import os
import re
import math
import shutil
import tempfile
import threading
import subprocess
import concurrent.futures
import shutil


from typing import Dict, List
from bs4 import BeautifulSoup
from alive_progress import alive_bar

from images_manipulator import PdfFile, SvgFile, PngFile

def split_pdf(pdf_path: str, pdfformat: List, result_folder: str, force=False):
    '''
    Split the pdf <pdf_path> into separate pages
    and rename all pages using rename_map delete other pages.
    Pages are saved in result_folder.
    Config should follow schemas/cardsconfig.json format.
    Dependency: pdfseparate
    '''
    assert not False

    with tempfile.TemporaryDirectory() as tmpdirname:
        subprocess.check_call(['pdfseparate', pdf_path, os.path.join(tmpdirname, '%d.pdf')])

        for card in pdfformat:
            input_pdf = os.path.join(tmpdirname, f'{ card["pdfpage"] }.pdf')
            output_pdf = os.path.join(result_folder, f'{ card["cardid"] }-{ card["side"]}.pdf')
            print(card)
            print(output_pdf)
            if 'options' in card and  'crop' in card['options']:
                    crop = card['options']['crop']
                    subprocess.check_call(['gs', '-o', output_pdf, '-sDEVICE=pdfwrite',
                                    f'-g{ int(10*crop["width"])}x{ int(10*crop["height"])}',
                                    '-c', f'<</PageOffset [{-crop["x"]} {-crop["y"]}]>> setpagedevice',
                                    '-f', input_pdf])
            else:
                shutil.move(
                    input_pdf,
                    output_pdf
                )

            # Must be called after crop
            if 'options' in card and 'orientation' in card['options']:
                tmp_filename = os.path.join(tmpdirname, f'{ card["cardid"] }-{ card["side"]}.pdf')
                shutil.copy(output_pdf, tmp_filename)
                subprocess.check_call(['pdftk', tmp_filename, 'cat', f'1{card["options"]["orientation"]}',
                                        'output', output_pdf])
    assert len(os.listdir(result_folder)) == len(pdfformat)

def export_and_compress_svg(path_to_pdf_cards, result_folder, force=False, nb_threads=1, replacements=[], pdf_font_strategy='keep'):
    '''
    Convert each .pdf from path_to_pdf_cards into svg and
    save it to <result_folder>/svg.
    This function is parallized on <nb_threads> threads

    If not force and files already exist, do nothing.
    Dependency: inkscape
    '''
    assert not force
    svg_dir = os.path.join(result_folder, 'svg')
    pdf_filenames = [x for x in os.listdir(path_to_pdf_cards) if x.endswith('.pdf')]
    if not os.path.exists(svg_dir):
        os.mkdir(svg_dir)

    image_replacements = []
    for replacement in replacements:
        image_replacements.append((PngFile(replacement["source"]), SvgFile(replacement["replacement"]), replacement["similarity"]))

    def _export_and_compress(pdf_filename, bar):
        svg_file = PdfFile(os.path.join(path_to_pdf_cards, pdf_filename)).to_svg(pdf_font_strategy)
        svg_file.set_svg_string(svg_file.svg_string.replace('ArialMT', 'Arial'))
        svg_file.compress_binary_images().replace_binary_images_by_svg(image_replacements)

        svg_file = svg_file.compress_scour()

        # Remove icc-colors
        svg_string = svg_file.svg_string
        if 'icc-color' in svg_string:
            pattern = re.compile(r'(?P<func>(fill)|(stroke)|(stop-color))="(?P<hexa>#[0-9|a-f]{6}) icc-color\((sRGB|Generic)\-[^ ]*, ((\d+(\.\d+)?)(, )?){4}\)"')
            svg_string = pattern.sub('\g<func>="\g<hexa>"', svg_string)
            if 'icc-color' in svg_string:
                svg_file.copy(os.path.join(svg_dir, pdf_filename + '--.svg'), force=True)
                raise ValueError(f'icc-color in svg string for {pdf_filename}')
            svg_file.set_svg_string(svg_string)

        prefix = pdf_filename[:-4]
        svg_file.prefixes_all_ids(prefix)

        svg_filename = os.path.join(
            svg_dir, pdf_filename.replace('.pdf', '.svg'))
        svg_file.move(svg_filename)
        bar()

    with alive_bar(len(pdf_filenames)) as bar:
        with concurrent.futures.ThreadPoolExecutor(max_workers=nb_threads) as executor:
            futures = []
            for pdf_filename in pdf_filenames:
                futures.append((executor.submit(_export_and_compress, pdf_filename, bar), pdf_filename))

            while len(futures) > 0:
                retry = []
                for future, pdf_filename in futures:
                    try:
                        future.result()

                    except Exception as exc:
                        print(exc)
                        print('retry', pdf_filename)
                        retry.append((executor.submit(_export_and_compress, pdf_filename, bar), pdf_filename))
                futures = retry

def convert_pdf_to_images(path_to_pdf_cards, result_folder, force=False, nb_threads=1):
    '''
    Convert each pdf page to a default image and webp
    '''
    pdf_filenames = [x for x in os.listdir(path_to_pdf_cards) if x.endswith('.pdf')]
    default_images_dir = os.path.join(result_folder,'default')

    if not os.path.exists(default_images_dir):
        os.mkdir(default_images_dir)
    for size in [125, 250, 450, 600]:
        if not os.path.exists(os.path.join(result_folder, str(size))):
            os.mkdir(os.path.join(result_folder, str(size)))
    def _convert_pdf_to_images(pdf_filenames, bar):
        for pdf_filename in pdf_filenames:
            bar()
            bar.text = f'Export { pdf_filename }'
            pdf_file = PdfFile(os.path.join(path_to_pdf_cards, pdf_filename))

            result_image = None
            if 'back' in pdf_filename:
                result_image = pdf_file.to_png()

            else:
                result_image = pdf_file.to_jpg()

            default_image = result_image.resize(600, 600).compress().move(
                os.path.join(default_images_dir, pdf_filename[:-4] + result_image.suffix))

            for size in [125, 250, 450, 600]:
                default_image.to_webp(size, size).move(
                    os.path.join(result_folder, str(size), pdf_filename[:-4] + '.webp')
                )

    with alive_bar(len(pdf_filenames)) as bar:
        nb_files_by_thread = math.ceil(len(pdf_filenames)/nb_threads)
        threads = []
        for k in range(nb_threads):
            threads.append(threading.Thread(target=_convert_pdf_to_images, args=(
                pdf_filenames[k*nb_files_by_thread: min(len(pdf_filenames), (k+1)*nb_files_by_thread)], bar)))

        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()

def guess_card_title(svg_filename: str) -> Dict:
    '''
    Guess the card title.
    '''
    def _parse_style(style_str: str):
        style = [x.split(':') for x in text_soup['style'].split(';')]
        style = {x[0]: x[1] for x in style}
        return style

    svg_file = SvgFile(svg_filename)
    soup = BeautifulSoup(svg_file.svg_string, 'xml')
    soup_texts = list(soup.find_all('text'))
    all_texts = []
    for text_soup in soup_texts:

        style = _parse_style(text_soup['style']) if 'style' in text_soup  else ''
        if 'font-size' in style:
            font_size = style['font-size']
            if font_size.endswith('px'):
                font_size = float(font_size[:-2])
            else:
                raise NotImplementedError()
        else:
            font_size = 0

        current_text = []
        for child in text_soup.children:
            current_text.append(child.text)
        all_texts.append({'text': ' '.join(current_text), 'font-size': font_size})

    possible_texts = []
    for text in all_texts:
        if len(text['text']) <= 2:
            # Probably the card number
            continue
        possible_texts.append(text)

    if len(possible_texts) == 0:
        return { 'text': ''}

    # print(possible_texts)
    possible_texts.sort(key= lambda text: text['font-size'])
    # biggest_text is the number

    # No texte found (maybe no title?)
    if len(possible_texts) == 0:
        return ''
    return possible_texts[-1]['text']

def guess_card_lot(svg_filename: str) -> int:
    '''
    Guess the lot number of the card. Require back
    '''
    lot = -1
    svg_file = SvgFile(svg_filename)
    soup = BeautifulSoup(svg_file.svg_string, 'xml')
    soup_texts = list(soup.find_all('text'))
    for text_soup in soup_texts:
        current_text = []
        for child in text_soup.children:
            current_text.append(child.text)
        current_text = ''.join(current_text)
        if current_text.startswith('Lot'):
            lot = int(current_text[4:])

    return lot


def guess_card_description(svg_filename: str) -> str:
    '''
    Guess the lot number of the card. Required back
    '''
    back_description = -1
    svg_file = SvgFile(svg_filename)
    soup = BeautifulSoup(svg_file.svg_string, 'xml')
    soup_texts = list(soup.find_all('text'))
    all_texts = []
    for text_soup in soup_texts:
        current_text = []
        for child in text_soup.children:
            current_text.append(child.text)
        current_text = ''.join(current_text)
        all_texts.append(current_text)
    if len(all_texts) == 0:
        return ''

    all_texts.sort(key=lambda text: len(text))
    print(all_texts)
    return all_texts[-1]
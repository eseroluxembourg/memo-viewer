'''
This script converts a pdf into different cards images
'''
import os
import json
import tempfile
import urllib.request
from typing import List, Dict
from utils import split_pdf, export_and_compress_svg, convert_pdf_to_images
from images_manipulator import PdfFile

from jsonschema import validate

def read_variants_files(moulinette_path):
    '''
    Read <moulinette_path>/pdfs.json
    '''
    variants_path = os.path.join(moulinette_path, '../variants.json')
    if not os.path.exists(variants_path):
        raise FileNotFoundError(f'{ variants_path } does not exist')

    with open(variants_path, newline='', encoding='utf-8') as fd:
        variants = json.load(fd)

    with open(os.path.join(os.path.dirname(__file__), '..', 'data-validation', 'schemas', 'variants.json')) as fd:
        schema = json.load(fd)

    validate(instance=variants, schema=schema)
    urls = set()
    for variant_id, variant in variants.items():
        for lang, data in variant['langs'].items():
            assert data['url'] == '' or \
                data['url'] not in urls, f'{data["url"]} is present at least twice (variant { variant_id } - lang { lang })'
            urls.add(data['url'])

    return variants

def read_pdfformat(moulinette_path, pdfformat_filename) -> Dict:
    '''
    Read <moulinette_path>/<pdfformat_filename>
    '''
    pdfformat_path = os.path.join(moulinette_path, pdfformat_filename)

    if not os.path.exists(pdfformat_path):
        raise FileNotFoundError(f'{ pdfformat_path } does not exist')

    with open(pdfformat_path, newline='', encoding='utf-8') as fd:
        pdfformat = json.load(fd)

    with open(os.path.join(os.path.dirname(__file__), 'schemas', 'pdfformat.json')) as fd:
        schema = json.load(fd)

    validate(instance=pdfformat, schema=schema)
    return pdfformat

def read_replacements(moulinette_path, replacement_filename) -> List:
    '''
    Parse a ; separated csv file (fromimage;toimage;similarity)
    and return its content as a list
    '''
    replacements_path = os.path.join(moulinette_path, replacement_filename)

    if not os.path.exists(replacements_path):
        raise FileNotFoundError(f'{ replacements_path } does not exist')

    with open(replacements_path, newline='', encoding='utf-8') as fd:
        replacements = json.load(fd)

    with open(os.path.join(os.path.dirname(__file__), 'schemas', 'replacements.json')) as fd:
        schema = json.load(fd)

    validate(instance=replacements, schema=schema)
    for k in range(len(replacements)):
        replacements[k]["source"] = os.path.join(moulinette_path, replacements[k]["source"])
        replacements[k]["replacement"] = os.path.join(moulinette_path, replacements[k]["replacement"])

    return replacements


def download_pdf(url, pdf_path):
    if os.path.exists(pdf_path):
        print(f'Skip {pdf_path} download')
        return

    if 'drive.google.com' in url:
        import gdown
        gdown.download(url, pdf_path, quiet=False, fuzzy=True)
    else:
        urllib.request.urlretrieve(url, pdf_path)


def list_cards_filenames(cards_folder, card_ids):
    paths = []

    for card_id in card_ids:
        front_name = f'{card_id}-front'
        back_name = f'{card_id}-back'

        paths.extend([
            os.path.join(cards_folder, 'default', front_name + '.jpg'),
            os.path.join(cards_folder, 'default', back_name + '.png'),
            os.path.join(cards_folder, '125', front_name + '.webp'),
            os.path.join(cards_folder, '125', back_name + '.webp'),
            os.path.join(cards_folder, '250', front_name + '.webp'),
            os.path.join(cards_folder, '250', back_name + '.webp'),
            os.path.join(cards_folder, '450', front_name + '.webp'),
            os.path.join(cards_folder, '450', back_name + '.webp'),
            os.path.join(cards_folder, '600', front_name + '.webp'),
            os.path.join(cards_folder, '600', back_name + '.webp'),
            os.path.join(cards_folder, 'svg', front_name + '.svg'),
            os.path.join(cards_folder, 'svg', back_name + '.svg'),
        ])

    return paths

def cards_already_generated(cards_folder, card_ids):

    for path in list_cards_filenames(cards_folder, card_ids):
        if not os.path.exists(path):
            return False
    return True

def clean_card_files(cards_folder, card_id):

    for path in list_cards_filenames(cards_folder, [card_id]):
        if os.path.exists(path):
            os.remove(path)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Generates cards from a pdf input')

    parser.add_argument('--lang', '-l', type=str, required=False,
                        help='Lang generate')
    parser.add_argument('--variant', '-v', type=str, required=False,
                        help='Variant generate')
    parser.add_argument('--nb_threads', type=int, required=False,
                        help='Nb threads', default=4)
    parser.add_argument('--force',
                        action="store_true",
                        help='Set to force cards regeneration')

    args = parser.parse_args()

    moulinette_data = 'moulinette-data'
    variants = read_variants_files(moulinette_data)
    pdfs = []
    for variant_id, variant in variants.items():
        for lang_id, lang in variant['langs'].items():
            pdfs.append({
                'url': lang['url'],
                'format': lang['format'],
                'replacements': lang['replacements'],
                'version': variant_id,
                'id': f'{lang_id}_{variant_id}',
                'lang': lang_id
            })

    if args.variant is not None:
        pdfs = [x for x in pdfs if x["version"] == args.variant]

    if args.lang is not None:
        pdfs = [x for x in pdfs if x["lang"] == args.lang]

    print(f'> Generating { len(pdfs) } pdfs: { " ".join([x["id"] for x in pdfs]) }')

    pdfs_directory = os.path.join(moulinette_data, '_pdfs')
    if not os.path.exists(pdfs_directory):
        os.mkdir(pdfs_directory)

    if not os.path.exists('cards'):
        os.mkdir('cards')

    for pdf in pdfs:
        pdfformat = read_pdfformat(moulinette_data, pdf["format"])
        if "replacements" in pdf and pdf['replacements'] != '':
            replacements = read_replacements(moulinette_data, pdf["replacements"])
        else:
            replacements = []

        version_folder = os.path.join('cards', pdf["version"])
        if not os.path.exists(version_folder):
            os.mkdir(version_folder)

        result_folder = os.path.join(version_folder, pdf["lang"])
        if not os.path.exists(result_folder):
            os.mkdir(result_folder)

        cards_ids = [card['cardid'] for card in pdfformat]
        if not args.force and cards_already_generated(result_folder, cards_ids):
            print(f'> Skip pdf already generated { pdf["id"]}')
            continue

        pdf_path = os.path.join(pdfs_directory, f'{pdf["id"]}.pdf')
        if "url" in pdf and pdf['url'] != '':
            download_pdf(pdf["url"], pdf_path)

        PdfFile(pdf_path).compress(resize=True)

        card_ids = [x["cardid"] for x in pdfformat]
        for card_id in card_ids:
            clean_card_files(result_folder, card_id)

        with tempfile.TemporaryDirectory() as pdf_folder:
        # pdf_folder = 'pdf_test'
        # os.mkdir(pdf_folder)
        # if True:
            print('>> Split pdf')
            split_pdf(pdf_path, pdfformat, pdf_folder)

            print('>> Export and compress SVG')
            pdf_font_strategy = 'draw-all' if pdf['lang'] in ['si-SL', 'ml-IN'] else 'keep'
            export_and_compress_svg(pdf_folder, result_folder, nb_threads=args.nb_threads, replacements=replacements, pdf_font_strategy=pdf_font_strategy)

            print('>> Convert to images')
            convert_pdf_to_images(pdf_folder, result_folder, nb_threads=args.nb_threads)

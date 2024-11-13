'''
Script to generate all the _cards/*/XX-XX.md files for a new language.
These files have the correct field values except for title which 
have to be completed by hand
'''

import os
import sys
from pathlib import Path
import frontmatter # pip install python-frontmatter

file_path = os.path.realpath(__file__)
script_dir = os.path.dirname(file_path)

from utils import cardsmanipulation

if __name__ == '__main__':

    if len(sys.argv) != 2:
        print('Usage: python3 createcardsformsvg.py <new lang>')
        sys.exit(0)

    path_to_cards = '_cards'
    if not os.path.exists(path_to_cards):
        print(f'ERROR: { path_to_cards } does not exist.')    
        sys.exit(0)


    new_lang = sys.argv[1]
    print(f'Will create { new_lang } cards files')

    path_to_svg = os.path.join('cards', new_lang, 'svg')

    if not os.path.exists(path_to_svg):
        print(f'ERROR: { path_to_svg } does not exist.')
        sys.exit(0)

    cards = set()
    svgs = os.listdir(path_to_svg)
    for svg in svgs:
        cards.add(svg.split('-')[0])

    cards = list(cards)
    cards.sort()

    for card_id in cards:
        if card_id == '.gitkeep':
            continue
        print('card ', card_id)

        svg_front_file = os.path.join(path_to_svg, card_id + '-front.svg')
        print(svg_front_file)
        svg_back_file = os.path.join(path_to_svg, card_id + '-back.svg')
        new_file = os.path.join(path_to_cards, card_id, new_lang, 'index.md')
        if os.path.exists(new_file):
            print(f'Warning { new_file } was already present. Erased. Use git to undo this change')
            os.unlink(new_file)

        card = frontmatter.Post(content='')
        card['lot'] = cardsmanipulation.guess_card_lot(svg_back_file)
        card['num'] = int(card_id)# todo
        card['title'] = '' # todo
        card['backDescription'] = cardsmanipulation.guess_card_description(svg_back_file)

        card['title'] = cardsmanipulation.guess_card_title(svg_front_file)
        card.content = ''

        Path(new_file).parent.mkdir(parents=True, exist_ok=True)
        with open(new_file, 'w') as f:
            print(card)
            f.write(frontmatter.dumps(card))
        #     f.write(ref_lines[0] + '\n')
        #     # title =
        # # shutil.copy(reference_file, new_fil e)



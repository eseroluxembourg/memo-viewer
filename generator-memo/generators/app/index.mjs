import { default as Generator } from 'yeoman-generator';
import { default as matter } from 'gray-matter';

const slugify = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/(é|è|ê|à)/g, 'e')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

let seed = 1;
function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
class MemoGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('yo-rc', {
            description: 'Read and apply options from .yo-rc.json and skip prompting',
            type: Boolean,
            defaults: false,
        });
    }

    initializing() {
        this.log('Welcome to the memo generator!');

        this.skipPrompts = false;
        if (this.options['yo-rc']) {
            const config = this.config.getAll();

            this.log('Read and applied the following config from .yo-rc.json:\n');
            this.log(config);
            this.log('\n');

            this.freskLabel = config.freskLabel;
            this.style = {
                primaryColor: config.primaryColor,
                secondaryColor: config.secondaryColor,
            };
            this.freskUrl = config.freskUrl;
            this.freskSlug = config.freskSlug;
            this.defaultLanguage = config.defaultLanguage;
            this.defaultVariant = config.defaultVariant;
            this.populate = config.populate;

            this.skipPrompts = true;
        }
    }

    async prompting() {
        if (this.skipPrompts) return;

        this.freskLabel = (
            await this.prompt({
                type: 'input',
                name: 'freskLabel',
                message: "What's the name of your Fresk?",
                default: 'My wonderful fresk',
            })
        ).freskLabel;

        this.style = await this.prompt([
            {
                type: 'input',
                name: 'primaryColor',
                message: "What's the primary color (hex)",
                default: '#5190f5',
            },
            {
                type: 'input',
                name: 'secondaryColor',
                message: "What's the secondary color (hex)",
                default: '#e90000',
            },
        ]);
        this.freskSlug = slugify(this.freskLabel);

        this.freskUrl = (
            await this.prompt({
                type: 'input',
                name: 'freskUrl',
                message: 'What will be the url of your memo?',
                default: `${this.freskSlug}.memo.fresque.earth`,
            })
        ).freskUrl;

        this.defaultLanguage = (
            await this.prompt({
                type: 'input',
                name: 'defaultLanguage',
                message: 'Please enter the default language of your game',
                default: 'fr-FR',
            })
        ).defaultLanguage;

        this.defaultVariant = (
            await this.prompt({
                type: 'input',
                name: 'defaultVariant',
                message: 'Please enter the current version of your game',
                default: 'v1.0',
            })
        ).defaultVariant;

        this.populate = (
            await this.prompt({
                type: 'confirm',
                name: 'populate',
                message: 'Do you want to populate your memo with some dummy data?',
                default: false,
            })
        ).populate;

        this.config.set('freskLabel', this.freskLabel);
        this.config.set('primaryColor', this.style.primaryColor);
        this.config.set('secondaryColor', this.style.secondaryColor);
        this.config.set('freskUrl', this.freskUrl);
        this.config.set('freskSlug', this.freskSlug);
        this.config.set('defaultLanguage', this.defaultLanguage);
        this.config.set('defaultVariant', this.defaultVariant);
        this.config.set('populate', this.populate);
        this.config.save('.yo-rc.json');
    }

    writing() {
        this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
            FRESK_LABEL: this.freskLabel,
            FRESK_SLUG: this.freskSlug,
        });

        this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
            FRESK_SLUG: this.freskSlug,
        });

        this.fs.copyTpl(this.templatePath('settings.json'), this.destinationPath('settings.json'), {
            FRESK_LABEL: this.freskLabel,
            FRESK_SLUG: this.freskSlug,
            FRESK_URL: this.freskUrl,
        });

        this.fs.write(
            this.destinationPath('variants.json'),
            JSON.stringify({
                [this.defaultVariant]: {
                    default: true,
                    deprecated: false,
                    langs: {
                        [this.defaultLanguage]: {
                            format: '',
                            url: '',
                            replacements: '',
                        },
                    },
                },
            }),
            null,
            4,
        );

        this.fs.copyTpl(this.templatePath('assets/styles/local.scss'), this.destinationPath('assets/styles/local.scss'), {
            PRIMARY_COLOR: this.style.primaryColor,
            SECONDARY_COLOR: this.style.secondaryColor,
        });

        this.fs.copy(this.templatePath('.gitlab-ci.yml'), this.destinationPath('.gitlab-ci.yml'));
        this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

        this.fs.write(this.destinationPath('moulinette-data/.gitignore'), '_pdfs');

        this.fs.write(this.destinationPath('assets/fonts/.gitkeep'), '');

        this.fs.write(this.destinationPath('_cards/.gitkeep'), '');
        this.fs.write(this.destinationPath('_links/.gitkeep'), '');
        this.fs.writeJSON(this.destinationPath('_links/linksStyle.json'), {});
        this.fs.write(this.destinationPath('_cards/.gitkeep'), '');
        this.fs.write(this.destinationPath('_fresks/.gitkeep'), '');

        this.fs.write(this.destinationPath('images/illustrations/.gitkeep'), '');
        this.fs.write(this.destinationPath('images/logo/logo/.gitkeep'), '');
        this.fs.write(this.destinationPath('images/previews/.gitkeep'), '');
        this.fs.copy(this.templatePath('images/icons/card-number-icon.svg'), this.destinationPath('images/icons/card-number-icon.svg'));
        this.fs.copy(this.templatePath('images/unknown-card.png'), this.destinationPath('images/unknown-card.png'));

        this.fs.write(this.destinationPath('_pages/about/.gitkeep'), '');
        this.fs.copyTpl(this.templatePath('_pages/about/fr-FR.md'), this.destinationPath('_pages/about/fr-FR.md'), {
            FRESK_LABEL: this.freskLabel,
        });

        this.fs.write(this.destinationPath('_ansible/.gitignore'), 'hosts');
        this.fs.copyTpl(this.templatePath('_ansible/vars.yml'), this.destinationPath('_ansible/vars.yml'), {
            FRESK_SLUG: this.freskSlug,
            FRESK_URL: this.freskUrl,
        });

        if (this.populate) this._populating();
    }

    // This is also used for e2e testing
    _populating() {
        this.log('Generating dummy data');
        // Generating cards
        for (let k = 1; k <= 11; ++k) {
            const frontMatter = {
                num: k,
                lot: Math.ceil(k / 3).toString(),
                variants: ['v1.0', 'v0.0'],
            };
            // Card 10 was added in v1.0
            if (k === 10) {
                frontMatter.variants = ['v1.0'];
            }
            const content = matter.stringify('', frontMatter);
            this.fs.write(`_cards/${k}/index.md`, content);
        }

        const pdfFormat = [];
        for (let k = 0; k <= 20; ++k) {
            pdfFormat.push({
                pdfpage: k + 1,
                cardid: (1 + Math.floor(k / 2)).toString(),
                side: k % 2 === 0 ? 'front' : 'back',
                options: {},
            });
        }
        this.fs.writeJSON('moulinette-data/pdfformat-v1.0.json', pdfFormat);
        this.fs.writeJSON('variants.json', {
            'v1.0': {
                default: true,
                deprecated: false,
                langs: {
                    'fr-FR': {
                        format: 'pdfformat-v1.0.json',
                        url: '',
                        replacements: '',
                    },
                    'en-GB': {
                        format: 'pdfformat-v1.0.json',
                        url: '',
                        replacements: '',
                    },
                    'es-ES': {
                        format: '',
                        url: '',
                        replacements: '',
                    },
                },
            },
            'v0.0': {
                default: false,
                deprecated: true,
                langs: {
                    'fr-FR': {
                        format: '',
                        url: '',
                        replacements: '',
                    },
                    'es-ES': {
                        format: '',
                        url: '',
                        replacements: '',
                    },
                },
            },
        });

        // Generating links

        // Generating fresks

        for (let set = 1; set <= 4; ++set) {
            const fresk = {
                nodes: [],
                edges: [],
                background: [],
                version: '1.15.0',
                variants: ['v1.0', 'v0.0'],
                lot: set.toString(),
                title: {
                    'fr-FR': 'Lot 1',
                },
            };
            for (let k = 1; k <= 11; ++k) {
                if (Math.ceil(k / 3) <= set) {
                    fresk.nodes.push({
                        xPos: random() * 6,
                        yPos: random() * 3,
                        cardId: k.toString(),
                    });
                }
            }
            this.fs.writeJSON(`_fresks/fresk_${set}.json`, fresk);
        }
    }
}

export default MemoGenerator;

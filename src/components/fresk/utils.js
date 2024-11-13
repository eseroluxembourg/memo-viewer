const PRIMARY_COLOR = import.meta.env.SSR ? '#000' : window.getComputedStyle(document.documentElement).getPropertyValue('--primary');

const DEFAULT_EDGE_STYLE = {
    width: 2,
    color: PRIMARY_COLOR,
    widthConstraint: {
        maximum: 7,
    },
    arrows: {
        to: {
            enabled: true, // To show the arrow head
        },
    },
    smooth: {
        enabled: true,
        // dynamic continuous discrete diagonalCross straightCross horizontal vertical
        // curvedCW curvedCCW cubicBezier
        // best: discrete, vertical/horizontal, cubicBezier+forceDirection'vertical'/horizontal
        type: 'cubicBezier', // For cubicBezier curves: ['horizontal', 'vertical', 'none']
        forceDirection: 'horizontal',
        roundness: 0.8,
    },
};

/**
 *
 * Return the default overriden style for each status
 *
 * @param {*} status
 * @returns
 */
function statusEdgeStyle(status) {
    switch (status) {
        case 'invalid':
            return { hidden: true };
        case 'temporary':
            return { color: { color: '#aaa' }, dashes: true };
        // Todo style & filter
        case 'optional':
            return { hidden: true };
        case 'simplified':
            return { width: 0.05 };
        default:
            return {};
    }
}

export function applyEdgeStyle(edge, classStyles) {
    // Default edge style
    let r = {
        ...DEFAULT_EDGE_STYLE,
        ...statusEdgeStyle(edge.status),
    };

    for (const style of classStyles) r = { ...r, ...style };
    return { ...r, ...edge, class: classStyles };
}

function roundPosition(position) {
    return Math.round(10 * position) / 10;
}

const cardSize = 30;
const cardMarginRatio = 1.8;

const cardMargin = cardMarginRatio * cardSize;
const cardMarginX = cardMargin;
const cardMarginY = cardMargin;
const cardSpaceX = 2.9 * cardSize + cardMarginX; // 141
const cardSpaceY = 2.0 * cardSize + cardMarginY; // 114

export function toFreskCoordinates(x, y) {
    return {
        x: x * cardSpaceX,
        y: y * cardSpaceY,
    };
}

export function fromFreskCoordinates(x, y) {
    return {
        x: roundPosition(x / cardSpaceX),
        y: roundPosition(y / cardSpaceY),
    };
}

/**
 *
 * This function takes an svg path in input and draws it in an HTML canvas
 * This function is handmade and probably not the best one but it works.
 * Done for aktivisda
 *
 * @param {*} ctx
 * @param {*} path
 * @param {*} strokeStyle
 */
export const drawSvgPathOnCanvas = (ctx, path, strokeStyle) => {
    const commands = [...path.matchAll(/(m|M|v|V|h|H|z|Z|l|L|c|C)(( |,)-?\d*(\.\d+)?)*/g)].map((x) => x[0]);
    ctx.beginPath();
    let x = 0;
    let y = 0;

    for (let k = 0; k < commands.length; ++k) {
        const command = commands[k][0];
        if (command === 'z' || command === 'Z') {
            ctx.closePath();
            continue;
        }
        const numbers = [...commands[k].matchAll(/-?\d+\.?\d*e?-?\d*?/g)].map((x) => parseFloat(x[0]));
        let numberIndex = 0;
        while (numberIndex < numbers.length) {
            switch (command) {
                case 'M': {
                    x = numbers[numberIndex];
                    ++numberIndex;
                    y = numbers[numberIndex];
                    ++numberIndex;
                    ctx.moveTo(x, y);
                    break;
                }
                case 'm': {
                    const dx = numbers[numberIndex];
                    ++numberIndex;
                    const dy = numbers[numberIndex];
                    ++numberIndex;
                    x += dx;
                    y += dy;
                    ctx.moveTo(x, y);
                    break;
                }

                case 'L': {
                    x = numbers[numberIndex];
                    ++numberIndex;
                    y = numbers[numberIndex];
                    ++numberIndex;
                    ctx.lineTo(x, y);
                    break;
                }

                case 'l': {
                    const dx = numbers[numberIndex];
                    ++numberIndex;
                    const dy = numbers[numberIndex];
                    ++numberIndex;
                    x += dx;
                    y += dy;
                    ctx.lineTo(x, y);
                    break;
                }

                case 'C': {
                    const cp1x = numbers[numberIndex];
                    ++numberIndex;
                    const cp1y = numbers[numberIndex];
                    ++numberIndex;
                    const cp2x = numbers[numberIndex];
                    ++numberIndex;
                    const cp2y = numbers[numberIndex];
                    ++numberIndex;
                    x = numbers[numberIndex];
                    ++numberIndex;
                    y = numbers[numberIndex];
                    ++numberIndex;
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                    break;
                }

                case 'c': {
                    const dcp1x = numbers[numberIndex];
                    ++numberIndex;
                    const dcp1y = numbers[numberIndex];
                    ++numberIndex;
                    const dcp2x = numbers[numberIndex];
                    ++numberIndex;
                    const dcp2y = numbers[numberIndex];
                    ++numberIndex;
                    const dx = numbers[numberIndex];
                    ++numberIndex;
                    const dy = numbers[numberIndex];
                    ++numberIndex;
                    ctx.bezierCurveTo(x + dcp1x, y + dcp1y, x + dcp2x, y + dcp2y, x + dx, y + dy);
                    x += dx;
                    y += dy;
                    break;
                }

                case 'v': {
                    const dy = numbers[numberIndex];
                    ++numberIndex;
                    y += dy;
                    ctx.lineTo(x, y);
                    break;
                }

                case 'h': {
                    const dx = numbers[numberIndex];
                    ++numberIndex;
                    x += dx;
                    ctx.lineTo(x, y);
                    break;
                }

                case 'V': {
                    y = numbers[numberIndex];
                    ++numberIndex;
                    ctx.lineTo(x, y);
                    break;
                }

                case 'H': {
                    x = numbers[numberIndex];
                    ++numberIndex;
                    ctx.lineTo(x, y);
                    break;
                }
            }
        }
    }
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.save();
};

export const CARD_SIZE = cardSize;

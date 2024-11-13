<template>
    <svg id="svg8" width="35" height="35" version="1.1" viewBox="0 0 9.2604 9.2604" xmlns="http://www.w3.org/2000/svg">
        <title id="unique-id">{{ title }}</title>
        <defs id="defs2">
            <marker id="Arrow2Lend" overflow="visible" orient="auto">
                <path
                    id="path1406"
                    transform="scale(1.1) rotate(180) translate(1)"
                    d="m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z"
                    fill-rule="evenodd"
                    stroke-linejoin="round" />
            </marker>
        </defs>
        <g id="layer1" transform="translate(0 -287.74)">
            <rect id="card-1" x=".33073" y="288.21" width="4.8428" height="2.7403" ry=".39101" style="paint-order: stroke markers fill" />
            <path
                id="link"
                d="m5.1027 289.61c1.0017 0.80837 1.5102 1.113 1.9608 3.8743"
                fill="none"
                marker-end="url(#Arrow2Lend)"
                stroke="#000"
                stroke-width=".2" />
            <rect id="card-2" x="4.1223" y="293.62" width="4.8428" height="2.7403" ry=".39101" style="paint-order: stroke markers fill" />
        </g>
    </svg>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>

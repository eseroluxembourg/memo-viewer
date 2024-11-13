<template>
    <div>
        <div class="visu" ref="visualization"></div>
    </div>
</template>

<script>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { toFreskCoordinates, drawSvgPathOnCanvas } from './utils';

const arrayDiff = (arr1, arr2) => arr1.filter((x) => arr2.indexOf(x) === -1);

export default {
    name: 'FreskVisjsInterface',
    props: {
        nodes: Array,
        msg: String,
        edges: Array,
        background: Array,
    },
    data: () => ({
        graphDataSet: {
            nodes: null,
            edges: null,
        },
        network: null,
        unwatchers: {},
    }),
    beforeUnmount() {
        if (this.unwatchers.nodes) this.unwatchers.edges();
        if (this.unwatchers.nodes) this.unwatchers.nodes();
    },
    mounted() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        // create a network
        const container = this.$refs.visualization;

        const options = {
            // autoResize: true,
            width: '100%',
            physics: {
                enabled: false,
            },
        };

        // mount data
        // From https://github.com/alexcode/vue2vis/blob/master/src/utils.js
        this.graphDataSet.edges = new DataSet(this.edges);
        // We attach deep watcher on the prop to propagate changes in the DataSet
        const callbackEdges = (value) => {
            if (Array.isArray(value)) {
                const newIds = new DataSet(value).getIds();
                const diff = arrayDiff(this.graphDataSet.edges.getIds(), newIds);
                this.graphDataSet.edges.update(value);
                this.graphDataSet.edges.remove(diff);

                // Fit the network on edges changes
                // self.networkFit();
            }
        };

        this.unwatchers.edges = this.$watch('edges', callbackEdges, {
            deep: true,
        });

        this.graphDataSet.nodes = new DataSet(this.nodes);

        // We attach deep watcher on the prop to propagate changes in the DataSet
        const callback = (value) => {
            if (Array.isArray(value)) {
                const newIds = new DataSet(value).getIds();
                const diff = arrayDiff(this.graphDataSet.nodes.getIds(), newIds);
                this.graphDataSet.nodes.update(value);
                this.graphDataSet.nodes.remove(diff);
            }
        };

        this.unwatchers.nodes = this.$watch('nodes', callback, {
            deep: true,
        });

        this.network = new Network(container, this.graphDataSet, options);

        this.network.on('beforeDrawing', this.drawBackground);

        this.network.on('selectNode', function (params) {
            const selectedNodes = params.nodes;
            const selectedEdges = params.edges;
            if (selectedNodes.length === 1) {
                self.network.focus(selectedNodes[0], {
                    scale: 2,
                    animation: true,
                });
                self.$emit('node-selection', selectedNodes[0]);
            } else if (selectedEdges.length == 1) {
                self.$emit('edge-selection', selectedEdges[0]);
            } else {
                console.warn('click on nothing');
            }
        });

        this.network.on('deselectNode', function (params) {
            const newSelectedNodes = params.nodes;
            const oldSelectedNodes = params.previousSelection.nodes;
            const removed = oldSelectedNodes.filter(function (n) {
                return newSelectedNodes.indexOf(n) === -1;
            });

            // if (newSelectedNodes.length === 0) {
            //     self.networkFit();
            // }
            self.$emit('node-deselection', removed);
        });

        this.network.on('doubleClick', function (params) {
            const selectedNodes = params.nodes;
            const selectedEdges = params.edges;
            if (selectedNodes.length === 1) {
                self.$emit('node-double-selection', selectedNodes[0]);
            } else if (selectedEdges.length == 1) {
                self.$emit('edge-double-selection', selectedEdges[0]);
            } else {
                // self.networkFit();
            }
        });

        this.network.on('dragStart', function (params) {
            const selectedNodes = params.nodes;
            const selectedEdges = params.edges;
            if (selectedNodes.length === 1) {
                self.$emit('node-selection', selectedNodes[0]);
            } else if (selectedEdges.length == 1) {
                self.$emit('edge-selection', selectedEdges[0]);
            } else {
                // self.networkFit();
            }
        });

        this.network.on('dragEnd', function (params) {
            const selectedNodes = params.nodes;
            const selectedEdges = params.edges;
            if (selectedNodes.length === 1) {
                self.$emit('node-dragend', { nodeId: selectedNodes[0], pos: params.pointer.canvas });
            } else if (selectedEdges.length == 1) {
                self.$emit('edge-dragend', selectedEdges[0]);
            } else {
                // self.networkFit();
            }
        });
    },
    methods: {
        exportImage(filename) {
            this.$refs.visualization.style.width = '6000px';
            this.$refs.visualization.style.height = '3000px';
            this.network.fit({
                maxZoomLevel: 1000,
                animation: true,
            });
            setTimeout(() => {
                const canvas = document.getElementsByTagName('canvas')[0];
                const url = canvas.toDataURL('image/png');

                const link = document.createElement('a');

                link.download = filename;
                link.href = url;
                document.body.appendChild(link);
                link.click();

                // // cleanup temporary elements
                document.body.removeChild(link);

                this.$refs.visualization.style.width = 'unset';
                this.$refs.visualization.style.height = '100%';
                this.networkFit();
            }, 8000);
        },
        networkFit() {
            if (this.network) {
                this.network.fit({
                    animation: true,
                });
            }
        },
        drawBackground(ctx) {
            const drawRectangle = (ctx, x, y, width, height, fillStyle) => {
                ctx.beginPath();

                ctx.lineTo(x - width / 2, y - height / 2);
                ctx.lineTo(x + width / 2, y - height / 2);
                ctx.lineTo(x + width / 2, y + height / 2);
                ctx.lineTo(x - width / 2, y + height / 2);
                ctx.closePath();
                ctx.fillStyle = fillStyle;
                ctx.fill();
                ctx.save();
            };

            for (const element of this.background) {
                switch (element.shape) {
                    case 'rectangle': {
                        const { x, y } = toFreskCoordinates(element.x, element.y);
                        const topRightCorner = toFreskCoordinates(element.x + element.width, element.y + element.height);
                        drawRectangle(ctx, x, y, topRightCorner.x - x, topRightCorner.y - y, element.fillStyle);
                        break;
                    }
                    case 'path': {
                        drawSvgPathOnCanvas(ctx, element.path, element.strokeStyle);
                        break;
                    }
                    default:
                        console.error(`Undefined shape ${element.shape} for background element`);
                }
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.visu {
    background: linear-gradient(#ffffff, #efeeee);
    /* magic number to replace */
    // TODO update in memo
    // height: calc(100vh - 100px);
    position: relative;
    height: 100%;
}
</style>

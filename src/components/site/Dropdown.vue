<script setup></script>
<template>
    <div class="dropdown menu-item">
        <slot name="header" />
        <div class="dropdown-content" tabindex="1">
            <!-- Versions -->
            <slot name="content" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'DropdownComponent',
};
</script>
<style lang="scss" scoped>
.dropdown {
    &:hover,
    &:active,
    &:focus {
        .dropdown-content {
            display: block;
        }
    }

    position: relative;

    .dropdown-content {
        @media only screen and (max-width: 480px) {
            & {
                position: fixed;
                top: 54px;
                width: 100%;
            }
        }

        transition-property:
            color,
            background-color,
            border-color,
            text-decoration-color,
            fill,
            stroke,
            opacity,
            box-shadow,
            transform,
            filter,
            -webkit-backdrop-filter;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
            backdrop-filter;
        transition-property:
            color,
            background-color,
            border-color,
            text-decoration-color,
            fill,
            stroke,
            opacity,
            box-shadow,
            transform,
            filter,
            backdrop-filter,
            -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        transition-duration: 0.2s;

        display: none;
        position: absolute;
        right: 0;
        overflow: hidden;
        background: #f9f9f9;
        --tw-scale-x: 0.95;
        --tw-scale-y: 0.95;
        transform-origin: top;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y))
            scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }
}
</style>

<script setup>
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/solid';
</script>

<template>
    <div>
        <label class="label">
            <span class="label-text">{{ $t('common.undo') }}</span>
        </label>
        <button class="sm:col-span-2 btn btn-square btn-ghost" @click="$emit('click')">
            <ArrowUturnLeftIcon class="w-4 h-4" />
        </button>
    </div>
</template>

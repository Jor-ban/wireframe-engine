<script setup lang="ts">
  import {IFurniture} from "@/app/schemas/furniture.interface";

  const props = defineProps<{
    furniture: IFurniture
  }>()

  const emit = defineEmits<{
    select: [IFurniture]
  }>()


</script>

<template>
  <div class="card">
    <img v-if="props.furniture.preview_photo_url" :src="props.furniture.preview_photo_url" alt="">
    <img v-else src="@/static/images/images.png" alt="">
    <p>{{ props.furniture.name }}</p>
    <button @click="emit('select', props.furniture)" class="btn">Выбрать</button>
  </div>
</template>

<style scoped>
  .card {
    width: 150px;
    height: 200px;
    display: inline-block;
    border: 1px solid #ddd;
    padding: 5px;
    color: black;
    border-radius: 10px;
  }

  img {
    border-radius: 6px 6px 0 0;
    width: 150px;
    height: 130px;
    object-fit: cover;
  }

  p {
    margin: 5px;
  }

  .btn {
    width: 100%;
    border-radius: 0 0 6px 6px;
  }
</style>
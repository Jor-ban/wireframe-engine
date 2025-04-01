<script setup lang="ts">
  import { state } from '../state/state'
  import {ref, onUnmounted, onMounted, reactive} from 'vue'
  import {fromEvent} from "rxjs";
  import {IFurniture} from "@/app/schemas/furniture.interface";
  import FurnitureCard from "@/app/ui/components/furniture-card.vue";

  const btnsLocation = ref<{x: number, y: number} | null>(null)
  const addObjectModalVisible = ref<boolean>(false)
  const furnitureList = ref<IFurniture[]>([])
  const loading = ref<boolean>(false)
  const state$ = reactive(state)

  const sub = fromEvent<MouseEvent>(document, 'mouseup').subscribe((e) => {
    setTimeout(() => {
      if(state.clickedBlock$.value && !addObjectModalVisible.value) {
        btnsLocation.value = { x: e.x, y: e.y }
      } else {
        btnsLocation.value = null
      }
    })
  })
  const loadingSub = state.loadingInProgress$.subscribe((value) => {
    loading.value = value
  })

  const addBtnClick = async () => {
    btnsLocation.value = null
    if(!furnitureList.value?.length) {
      loading.value = true
    }
    addObjectModalVisible.value = true
    try {
      furnitureList.value = await state.sbClient.from('furniture').select().then(r => r.data)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const replaceBtnClick = async () => {
    btnsLocation.value = null
    if(!furnitureList.value?.length) {
      loading.value = true
    }
    addObjectModalVisible.value = true
    try {
      furnitureList.value = await state.sbClient.from('furniture').select().then(r => r.data)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const closeModal = () => {
    if(!loading.value) {
      addObjectModalVisible.value = false
      state.clickedBlock$.next(null)
    }
  }

  const rotateObject = () => {
    btnsLocation.value = null
    state$.activeObjectRotationRequest$.next()
  }

  const deleteObject = () => {
    btnsLocation.value = null
    state$.activeObjectRemovalRequest$.next()
  }

  const selectFurniture = (furniture: IFurniture): void => {
    addObjectModalVisible.value = false
    if(!state$.clickedFurniture$.value) {
      state.objectAddRequested$.next(furniture)
    } else {
      state.activeObjectReplaceRequest$.next(furniture)
    }
    state.loadingInProgress$.next(true)
    btnsLocation.value = null
  }

  const uiClicked = (event: MouseEvent) => {
    state.clickedBlock$.next(null)
    btnsLocation.value = null
  }

  onUnmounted(() => {
    sub.unsubscribe()
    loadingSub.unsubscribe()
  })

</script>

<template>
  <div @click.stop.prevent="uiClicked($event)">
    <div class="modal-bg" @click.stop.prevent="closeModal" v-if="addObjectModalVisible || loading"></div>
    <div v-if="btnsLocation">
      <button
          class="floating-btn btn"
          v-if="!state$.clickedFurniture$.value"
          :style="{ top: btnsLocation.y + 'px', left: btnsLocation.x + 'px' }"
          @click.stop.prevent="addBtnClick()"
      >
        (+) Добавить предмет
      </button>
      <div class="floating-btns-row" v-else>
        <button
            class="floating-btn btn"
            @mouseup.stop.prevent="deleteObject()"
            :style="{ top: (btnsLocation.y - 40) + 'px', left: btnsLocation.x + 'px' }"
        >
          [ - ] Удалить предмет
        </button>
        <button
            class="floating-btn btn"
            @mouseup.stop.prevent="rotateObject()"
            :style="{ top: btnsLocation.y + 'px', left: (btnsLocation.x + 60) + 'px' }"
        >
          (↺) Повернуть предмет
        </button>
        <button
            class="floating-btn btn"
            @mouseup.stop.prevent="replaceBtnClick()"
            :style="{ top: (btnsLocation.y + 40) + 'px', left: btnsLocation.x + 'px' }"
        >
          ( ~ ) Заменить предмет
        </button>
      </div>
    </div>
    <div @click.stop.prevent="closeModal" v-if="addObjectModalVisible" class="add-obj-modal">
      <button class="btn">(x) Закрыть</button>
      <div class="add-obj-modal__content">
        <template v-for="furniture in furnitureList">
          <furniture-card class="furniture" :furniture="furniture" @select="selectFurniture($event)"/>
        </template>
      </div>
    </div>
    <div class="loading-modal" v-if="loading">
      <img class="loading-modal__spinner" src="@/static/images/spinner.gif" alt="">
    </div>
  </div>
</template>

<style scoped>
  .modal-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
  }

  .add-obj-modal {
    position: absolute;
    z-index: 9999;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    width: 50vw;
    height: 60vh;
    min-width: 500px;
    min-height: 500px;
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-sizing: border-box;
  }
  .add-obj-modal__content {
    padding-top: 20px;
    display: flex;
    gap: 10px;
  }
  .loading-modal {
    position: absolute;
    z-index: 9999;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-sizing: border-box;
  }
  .loading-modal__spinner {
    width: 100px;
  }
  .floating-btn {
    position: fixed;

    z-index: 99999;
    transform: translate(-50%, -50%);
  }

</style>

<style>
  * {
    pointer-events: auto;
  }

  .btn {
    background-color: #565656;
    color: white;
    border-radius: 20px;
    border: none;
    width: max-content;
    padding: 10px 20px;
    cursor: pointer;
  }
  .btn:hover {
    background-color: black;
  }
</style>
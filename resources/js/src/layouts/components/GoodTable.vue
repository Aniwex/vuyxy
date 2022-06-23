<template>
  <div>
    <!-- search input -->
    <div class="custom-search d-flex justify-content-start">
      <b-form-group>
        <div class="d-flex align-items-center">
          <h5 class="mr-1">Список обращений</h5>
          <b-form-input
            v-model="searchTerm"
            placeholder="Поиск"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
    </div>
    <div class="d-flex justify-content-start">
      <b-form-group>
        <b-dropdown
          @hide="handleHide($event)"
          @hidden="isCloseable = false"
          class="drop__down"
          variant="primary"
          left
          no-caret
        >
          <template #button-content
            ><filter-icon size="1x" class="custom-class"></filter-icon
          ></template>
          <b-dropdown-form>
            <div class="form-group">
              <p>Тэги</p>
              <b-dropdown-item class="dropitem__close" @click="closeMe()"
                >X</b-dropdown-item
              >
              <b-form-select v-model="selected" :options="options_tags">
              </b-form-select>
              <b-dropdown-divider />
              <p>Источник</p>
              <b-form-select v-model="selected" :options="options_source">
              </b-form-select>
              <b-dropdown-divider />
              <p>Дата и время</p>
              <b-form-datepicker
                local="ru"
                placeholder="Выберите дату и время"
                menu-class="w-100"
                calendar-width="100%"
                class="mb-2"
                selected-variant="primary"
                today-button
                reset-button
                close-button
              />
              <b-dropdown-divider />
              <p>Продолжительность Звонка</p>
              <b-form-input
                id="range-1"
                v-model="value_range"
                type="range"
                min="0"
                max="1129"
              ></b-form-input>
              <div class="mt-2">Значение: {{ value_range }}</div>
              <b-dropdown-divider />
              <p>Пользователь</p>
              <b-form-input id="basicInput" placeholder="Пользователь" />
              <b-dropdown-divider />
              <p>Целевой по мнению менеджера</p>
              <b-form-select v-model="selected" :options="options_manager">
              </b-form-select>
              <b-dropdown-divider />
              <p>Целевой по мнению клиента</p>
              <b-form-select v-model="selected" :options="options_client">
              </b-form-select>
              <b-dropdown-divider />
              <p>Группировка по пользователю</p>
              <b-form-checkbox v-model="selected" value="A" plain>
                Применить
              </b-form-checkbox>
              <b-dropdown-divider />
              <p>Удалённые</p>
              <b-form-select v-model="selected" :options="options_deleted">
              </b-form-select>
              <b-dropdown-divider />
            </div>
          </b-dropdown-form>
        </b-dropdown>
      </b-form-group>
    </div>
    <div class="custom-search d-flex justify-content-end" @click="sorted">
      Сортировать
    </div>
    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm,
      }"
      :select-options="{
        enabled: true,
        selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
        disableSelectInfo: true, // disable the select info panel on top
        selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
      }"
      :pagination-options="{
        enabled: true,
        perPage: pageLength,
      }"
    >
      <template slot="table-row" slot-scope="props">
        <!-- Column: Name -->
        <span v-if="props.column.field === 'ID'" class="text-nowrap">
          <!-- <b-avatar
            :src="props.row.imageUrl"
            class="mx-1"
          /> -->
          <span class="text-nowrap">{{ props.row.id }}</span>
        </span>
        <!-- Column: Date -->
        <span v-else-if="props.column.field === 'Date'" class="text-nowrap">
          <span class="text-nowrap">{{ props.row.date }}</span>
        </span>
        <!-- Column: call -->
        <span v-else-if="props.column.field === 'call'" class="text-nowrap">
          <span class="text-nowrap">{{ props.row.call }}</span>
        </span>
        <!-- Column: redirected -->
        <span v-else-if="props.column.field === 'redirected'">
          <span style="display: block; text-align: center">{{
            props.row.redirected
          }}</span>
        </span>
        <!-- Column: source -->
        <span v-else-if="props.column.field === 'source'">
          <span>{{ props.row.source }}</span>
        </span>
        <!-- Column: user -->
        <span v-else-if="props.column.field === 'user'">
          <span class="text-nowrap">{{ props.row.user }}</span>
        </span>
        <!-- Column: Managment -->
        <span v-else-if="props.column.field === 'Managment'">
          <check-icon size="1.5x" class="custom-class"></check-icon>
          <x-circle-icon size="1.5x" class="custom-class"></x-circle-icon>
        </span>
        <!-- Column: Client -->
        <span v-else-if="props.column.field === 'Client'">
          <check-icon size="1.5x" class="custom-class"></check-icon>
          <x-circle-icon size="1.5x" class="custom-class"></x-circle-icon>
        </span>
        <!-- Column: tags -->
        <span v-else-if="props.column.field === 'tag'">
          <span class="text-nowrap">{{ props.row.tag }}</span>
        </span>
        <!-- Column: Status -->
        <span v-else-if="props.column.field === 'status'">
          <b-badge :variant="statusVariant(props.row.status)">
            {{ props.row.status }}
          </b-badge>
        </span>

        <!-- Column: Action -->
        <span v-else-if="props.column.field === 'action'">
          <span>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="text-body align-middle mr-25"
                />
              </template>
              <b-dropdown-item>
                <feather-icon icon="Edit2Icon" class="mr-50" />
                <span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item>
                <feather-icon icon="TrashIcon" class="mr-50" />
                <span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </span>
        </span>
        <!-- Column: Common -->
      </template>

      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap"> Showing 1 to </span>
            <b-form-select
              v-model="pageLength"
              :options="['3', '5', '10']"
              class="mx-1"
              @input="
                (value) => props.perPageChanged({ currentPerPage: value })
              "
            />
            <span class="text-nowrap"> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value) => props.pageChanged({ currentPage: value })"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import {
  BAvatar,
  BBadge,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
  BDropdownGroup,
  BDropdownForm,
  BFormCheckbox,
  BFormDatepicker,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import store from "@/store/index";
import "vue-good-table/dist/vue-good-table.css";
import "./good-table.js";
import axios from "axios";
import { CheckIcon, XCircleIcon, FilterIcon } from "vue-feather-icons";
export default {
  components: {
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BDropdownGroup,
    BDropdownForm,
    BFormCheckbox,
    BFormDatepicker,
    CheckIcon,
    XCircleIcon,
    FilterIcon,
    BDropdownDivider,
  },
  data() {
    return {
      pageLength: 3,
      dir: false,
      columns: [
        {
          label: "ID",
          field: "ID",
        },
        {
          label: "Дата и время",
          field: "Date",
        },
        {
          label: "Продол. звонка",
          field: "call",
        },
        {
          label: "Перенаправлен на",
          field: "redirected",
        },
        {
          label: "Источник",
          field: "source",
        },
        {
          label: "Пользователь",
          field: "user",
        },
        {
          label: "Менеджер",
          field: "Managment",
        },
        {
          label: "Клиент",
          field: "Client",
        },
        {
          label: "Тэги обращения",
          field: "tag",
        },

        {
          label: "action",
          field: "action",
        },
      ],
      value_range: 0,
      selected: null,
      options_tags: [
        { value: null, text: "-" },
        { value: "балкон", text: "балкон" },
        { value: "окна", text: "окна" },
      ],
      options_source: [
        { value: null, text: "-" },
        {
          value: "Задарма: Adwords на nw61.ru + Я.Объявления",
          text: "Задарма: Adwords на nw61.ru + Я.Объявления",
        },
        { value: "Задарма: Оконский Директ", text: "Задарма: Оконский Директ" },
      ],
      options_manager: [
        { value: null, text: "-" },
        { value: "целевой", text: "целевой" },
        { value: "не целевой", text: "не целевой" },
        { value: "не установленный", text: "не установленный" },
      ],
      options_client: [
        { value: null, text: "-" },
        { value: "целевой", text: "целевой" },
        { value: "не целевой", text: "не целевой" },
        { value: "не проверенный", text: "не проверенный" },
      ],
      options_deleted: [
        { value: null, text: "-" },
        { value: "С удалённым", text: "С удалённым" },
        { value: "Только удалённое", text: "Только удалённое" },
      ],
      rows: [
        {
          id: 2696,
          date: "13.06.2022 15:14:27",
          call: "2",
          redirected: "—",
          source: "Задарма: Adwords на nw61.ru + Я.Объявления",
          user: "+7 (967) 106-02-00",
          tag: "окна",
        },
        {
          id: 2695,
          date: "23.06.2022 16:53:49",
          call: "03 мин 05 сек",
          redirected: "—",
          source: "Задарма: Оконский Директ",
          user: "+7 (988) 551-72-25",
          tag: "балкон",
        },
        {
          id: 2694,
          date: "13.06.2022 11:53:28",
          call: "8",
          redirected: "—",
          source: "Задарма: Adwords на nw61.ru + Я.Объявления",
          user: "+7 (916) 062-78-28",
          tag: "окна",
        },
      ],
      searchTerm: "",
      status: [
        {
          1: "Current",
          2: "Professional",
          3: "Rejected",
          4: "Resigned",
          5: "Applied",
        },
        {
          1: "light-primary",
          2: "light-success",
          3: "light-danger",
          4: "light-warning",
          5: "light-info",
        },
      ],
    };
  },
  methods: {
    handleHide(bvEvent) {
      if (!this.isCloseable) {
        bvEvent.preventDefault();
      } else {
        this.$refs.dropdown.hide();
      }
    },
    closeMe() {
      this.isCloseable = true;
      this.$refs.dropdown.hide();
    },
    stopPropagation() {
      console.log("stopPropagation");
    },
    sorted() {
      console.log(this.rows.filter((row) => row.tag === this.selected));
    },
  },

  created() {},
};
</script>

<style>
.dropitem__close {
  width: 45px;
  position: absolute;
  margin-top: 5px;
  top: 0;
  right: 0;
}
.drop__down .dropdown-menu {
  max-height: 410px;
  width: 400px;
  overflow-y: scroll;
}
</style>
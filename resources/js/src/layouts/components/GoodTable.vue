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

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
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
        perPage:pageLength
      }"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >

        <!-- Column: Name -->
        <span
          v-if="props.column.field === 'ID'"
          class="text-nowrap"
        >
          <!-- <b-avatar
            :src="props.row.imageUrl"
            class="mx-1"
          /> -->
          <span class="text-nowrap">{{ props.row.id }}</span>
        </span>
        <!-- Column: Date -->
        <span
          v-else-if="props.column.field === 'Date'"
          class="text-nowrap"
        >
          <span class="text-nowrap">{{ props.row.date }}</span>
        </span>
        <!-- Column: call -->
        <span
          v-else-if="props.column.field === 'call'"
          class="text-nowrap"
        >
          <span class="text-nowrap">{{ props.row.call }}</span>
        </span>
        <!-- Column: redirected -->
        <span
          v-else-if="props.column.field === 'redirected'"
        >
          <span style="display:block; text-align:center;">{{ props.row.redirected }}</span>
        </span>
        <!-- Column: source -->
        <span
          v-else-if="props.column.field === 'source'"
          
        >
          <span>{{ props.row.source }}</span>
        </span>
       <!-- Column: user -->
        <span
          v-else-if="props.column.field === 'user'"
        >
          <span class="text-nowrap">{{ props.row.user }}</span>
        </span>
        <!-- Column: Managment -->
        <span
          v-else-if="props.column.field === 'Managment'"
        >
          <check-icon size="1.5x" class="custom-class"></check-icon>
          <x-circle-icon size="1.5x" class="custom-class"></x-circle-icon>
        </span>
        <!-- Column: Client -->
        <span
          v-else-if="props.column.field === 'Client'"
        >
          <check-icon size="1.5x" class="custom-class"></check-icon>
          <x-circle-icon size="1.5x" class="custom-class"></x-circle-icon>
        </span>
        <!-- Column: tags -->
        <span
          v-else-if="props.column.field === 'tag'"
        >
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
                <feather-icon
                  icon="Edit2Icon"
                  class="mr-50"
                />
                <span>Edit</span>
              </b-dropdown-item>
              <b-dropdown-item>
                <feather-icon
                  icon="TrashIcon"
                  class="mr-50"
                />
                <span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template
        slot="pagination-bottom"
        slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap ">
              Showing 1 to
            </span>
            <b-form-select
              v-model="pageLength"
              :options="['3','5','10']"
              class="mx-1"
              @input="(value)=>props.perPageChanged({currentPerPage:value})"
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
              @input="(value)=>props.pageChanged({currentPage:value})"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
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
  BAvatar, BBadge, BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store/index'
import 'vue-good-table/dist/vue-good-table.css'
import './good-table.js'
import axios from 'axios'
import {CheckIcon,XCircleIcon} from 'vue-feather-icons'
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
    CheckIcon,
    XCircleIcon,
  },
  data() {
    return {
      pageLength: 3,
      dir: false,
      columns: [
        {
          label: 'ID',
          field: 'ID',
        },
        {
          label: 'Дата и время',
          field: 'Date',
        },
        {
          label: 'Продол. звонка',
          field: 'call',
        },
        {
          label: 'Перенаправлен на',
          field: 'redirected',
        },
        {
          label: 'Источник',
          field: 'source',
        },
        {
          label: 'Пользователь',
          field: 'user',
        },
        {
          label: 'Менеджер',
          field: 'Managment',
        },
        {
          label: 'Клиент',
          field: 'Client',
        },
        {
          label: 'Тэги обращения',
          field: 'tag',
        },
        {
          label: 'action',
          field: 'action',
        },
      ],
      rows: [{
        "id": 2696,
        "date": "13.06.2022 15:14:27",
        "call": "2",
        "redirected": "—",
        "source": "Задарма: Adwords на nw61.ru + Я.Объявления",
        "user":"+7 (967) 106-02-00",
        "tag": "окна",
        
      },
      {
        "id": 2695,
        "date": "13.06.2022 15:14:27",
        "call": "11",
        "redirected": "—",
        "source": "Задарма: Adwords на nw61.ru + Я.Объявления",
        "user":"+7 (968) 848-78-79",
        "tag": "балкон",
        
      },{
        "id": 2694,
        "date": "13.06.2022 11:53:28",
        "call": "8",
        "redirected": "—",
        "source": "Задарма: Adwords на nw61.ru + Я.Объявления",
        "user":"+7 (916) 062-78-28",
        "tag": "окна",
        
      },
      ],

    tableRowGrp: [
        {
            mode: "span",
            label: "Accountant",
            html: false,
            children: [
                {
                    id: 1,
                    avatar: require("@/assets/images/avatars/10-small.png"),
                    fullName: "Korrie O'Crevy",
                    email: "kocrevy0@thetimes.co.uk",
                    startDate: "09/23/2016",
                    salary: "$23896.35",
                    experience: "1 Year",
                    status: "Professional",
                },
            ],
        },
        {
            mode: "span",
            label: "Actuary",
            children: [
                {
                    id: 2,
                    avatar: require("@/assets/images/avatars/1-small.png"),
                    fullName: "Bailie Coulman",
                    email: "bcoulman1@yolasite.com",
                    startDate: "05/20/2018",
                    salary: "$13633.69",
                    status: "Current",
                },
            ],
        },
        {
            mode: "span",
            label: "Administrative Assistan",
            children: [
                {
                    id: 3,
                    avatar: require("@/assets/images/avatars/9-small.png"),
                    fullName: "Stella Ganderton",
                    email: "sganderton2@tuttocitta.it",
                    startDate: "03/24/2018",
                    salary: "$13076.28",
                    status: "Applied",
                },
                {
                    id: 4,
                    avatar: require("@/assets/images/avatars/3-small.png"),
                    fullName: "Dorolice Crossman",
                    email: "dcrossman3@google.co.jp",
                    startDate: "12/03/2017",
                    salary: "$12336.17",
                    status: "Professional",
                },
                {
                    id: 5,
                    avatar: require("@/assets/images/avatars/4-small.png"),
                    fullName: "Harmonia Nisius",
                    email: "hnisius4@gnu.org",
                    startDate: "08/25/2017",
                    salary: "$10909.52",
                    status: "Resigned",
                },
            ],
        },
        {
            mode: "span",
            label: "Analog Circuit Design manager",
            children: [
                {
                    id: 6,
                    avatar: require("@/assets/images/avatars/5-small.png"),
                    fullName: "Genevra Honeywood",
                    email: "ghoneywood5@narod.ru",
                    startDate: "06/01/2017",
                    salary: "$17803.8",
                    experience: "1 Year",
                    status: "Current",
                },
                {
                    id: 7,
                    avatar: require("@/assets/images/avatars/7-small.png"),
                    fullName: "Eileen Diehn",
                    email: "ediehn6@163.com",
                    startDate: "10/15/2017",
                    salary: "$18991.67",
                    status: "Professional",
                },
            ],
        },
        {
            mode: "span",
            label: "Analyst Programmer",
            children: [
                {
                    id: 8,
                    avatar: require("@/assets/images/avatars/9-small.png"),
                    fullName: "Richardo Aldren",
                    email: "raldren7@mtv.com",
                    startDate: "11/05/2016",
                    salary: "$19230.13",
                    status: "Rejected",
                },
                {
                    id: 9,
                    avatar: require("@/assets/images/avatars/2-small.png"),
                    fullName: "Allyson Moakler",
                    email: "amoakler8@shareasale.com",
                    startDate: "12/29/2018",
                    salary: "$11677.32",
                    status: "Applied",
                },
                {
                    id: 10,
                    avatar: require("@/assets/images/avatars/6-small.png"),
                    fullName: "Merline Penhalewick",
                    email: "mpenhalewick9@php.net",
                    startDate: "04/19/2019",
                    salary: "$15939.52",
                    status: "Professional",
                },
            ],
        },],
      searchTerm: '',
      status: [{
        1: 'Current',
        2: 'Professional',
        3: 'Rejected',
        4: 'Resigned',
        5: 'Applied',
      },
      {
        1: 'light-primary',
        2: 'light-success',
        3: 'light-danger',
        4: 'light-warning',
        5: 'light-info',
      }],
    }
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        Current      : 'light-primary',
        Professional : 'light-success',
        Rejected     : 'light-danger',
        Resigned     : 'light-warning',
        Applied      : 'light-info',
        /* eslint-enable key-spacing */
      }

      return status => statusColor[status]
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  created() {
    axios.get('./')
      .then(res => { console.log(res.data) })
  },
}
</script>

<style>

</style>
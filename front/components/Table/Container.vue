<template>
  <div class="table-container">
    <div class="header">
      <div style="width: 20px" v-if="checkable">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" />
      </div>
      <div
        v-for="(item, idx) in leftFixedFields"
        :key="'left' + idx"
        :style="{ width: item.width + 'px' }"
        @click="handleSort(item)"
      >
        {{ item.label }}
        <span
          v-if="
            item.sortable &&
            [item.sortField, `-${item.sortField}`].includes(sort)
          "
        >
          <font-awesome-icon
            :icon="['fas', sort === item.sortField ? 'caret-up' : 'caret-down']"
          />
        </span>
      </div>
      <div class="more-fields" ref="headMore" @scroll="syncScroll">
        <div
          v-for="(item, idx) in scrollableFields"
          :key="'scrollable' + idx"
          :style="{ width: item.width + 'px' }"
          @click="handleSort(item)"
        >
          {{ item.label }}
          <span
            v-if="
              item.sortable &&
              [item.sortField, `-${item.sortField}`].includes(sort)
            "
          >
            <font-awesome-icon
              :icon="[
                'fas',
                sort === item.sortField ? 'caret-up' : 'caret-down'
              ]"
            />
          </span>
        </div>
      </div>
      <div
        v-for="(item, idx) in rightFixedFields"
        :key="'right' + idx"
        :style="{ width: item.width + 'px' }"
        @click="handleSort(item)"
      >
        {{ item.label }}
        <span
          v-if="
            item.sortable &&
            [item.sortField, `-${item.sortField}`].includes(sort)
          "
        >
          <font-awesome-icon
            :icon="['fas', sort === item.sortField ? 'caret-up' : 'caret-down']"
          />
        </span>
      </div>
      <div style="width: 60px" v-if="openable"></div>
    </div>

    <div class="list">
      <el-skeleton :rows="5" animated v-if="loading"></el-skeleton>
      <template v-else>
        <div class="line" v-for="(line, idx) in data" :key="idx">
          <div style="width: 20px" v-if="checkable">
            <el-checkbox
              :modelValue="innerChecked.includes(getLineId(line))"
              @change="toggleLine(line)"
            />
          </div>
          <slot name="left" :row="line" :idx="idx" />
          <div class="more-fields" ref="more" @scroll="syncScroll">
            <slot :row="line" :idx="idx" />
          </div>
          <slot name="right" :row="line" :idx="idx" />
          <div style="width: 60px" v-if="openable">
            <el-button class="arrow" @click="$emit('open', line)">
              <font-awesome-icon icon="chevron-right" />
            </el-button>
          </div>
        </div>

        <el-empty
          v-if="data.length === 0"
          :description="$t('Nothing to show')"
        ></el-empty>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {},
    checked: {},
    sort: { type: String, default: '_id' },
    defaultSort: { type: String, default: '_id' },
    idField: {
      type: String,
      default: 'id'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const checkable = this.checked instanceof Array
    return {
      innerChecked: JSON.parse(JSON.stringify(this.checked ?? [])),
      checkable,
      selectAll: false,
      scrollLeft: 0,
      leftFixedFields: [],
      rightFixedFields: [],
      scrollableFields: []
    }
  },
  watch: {
    checked: {
      handler () {
        if (!this.checkable) return
        if (this.checked.length !== this.innerChecked.length)
          this.innerChecked = JSON.parse(JSON.stringify(this.checked ?? []))
      },
      deep: true
    },
    innerChecked: {
      handler () {
        if (!this.checkable) return
        this.selectAll = this.innerChecked.length === this.data.length
        this.$emit('update:checked', this.innerChecked)
      },
      deep: true
    }
  },
  computed: {
    openable () {
      return !!(this.$attrs && this.$attrs.onOpen)
    }
  },
  methods: {
    handleSort (item) {
      if (!item.sortable) return
      if (this.sort === item.sortField)
        this.$emit('update:sort', `-${item.sortField}`)
      else if (this.sort === `-${item.sortField}`)
        this.$emit('update:sort', this.defaultSort)
      else this.$emit('update:sort', item.sortField)
    },
    getLineId (line) {
      return line[this.idField]
    },
    handleSelectAll () {
      if (!this.selectAll) this.innerChecked = []
      else this.innerChecked = this.data.map(a => this.getLineId(a))
    },
    toggleLine (line) {
      const id = this.getLineId(line)
      if (this.innerChecked.includes(id))
        this.innerChecked = this.innerChecked.filter(a => a !== id)
      else this.innerChecked.push(id)
    },
    syncScroll (e) {
      this.scrollLeft = e.target.scrollLeft
      for (let el of this.$refs.more) {
        el.scrollLeft = this.scrollLeft
      }
      this.$refs.headMore.scrollLeft = this.scrollLeft
    },
    refreshScroll () {
      if (this.$refs.more) {
        for (let el of this.$refs.more) {
          el.scrollLeft = this.scrollLeft
        }
      }
      if (this.$refs.headMore) {
        this.$refs.headMore.scrollLeft = this.scrollLeft
      }
    },
    refreshLabels () {
      this.leftFixedFields = []
      this.rightFixedFields = []
      this.scrollableFields = []

      if (this.$slots.default) {
        const scrollableLine = this.$slots.default()
        for (let line of scrollableLine ?? []) {
          for (let child of line.children ?? []) {
            if (
              ['table-column', 'TableColumn'].includes(child.type?.name) ===
              false
            )
              continue
            this.scrollableFields.push({
              sortField: child.props.sortField ?? '',
              label: child.props.label ?? '',
              width: child.props.width ?? 200,
              sortable: child.props.sortable ?? false
            })
          }
        }
      }

      if (this.$slots.left) {
        const leftLine = this.$slots.left()
        for (let line of leftLine ?? []) {
          for (let child of line.children ?? []) {
            if (
              ['table-column', 'TableColumn'].includes(child.type?.name) ===
              false
            )
              continue
            this.leftFixedFields.push({
              sortField: child.props.sortField ?? '',
              label: child.props.label ?? '',
              width: child.props.width ?? 200,
              sortable: child.props.sortable ?? false
            })
          }
        }
      }

      if (this.$slots.right) {
        const rightLine = this.$slots.right()
        for (let line of rightLine ?? []) {
          if (line.children instanceof Array === false) line.children = [line]
          for (let child of line.children ?? []) {
            if (
              ['table-column', 'TableColumn'].includes(child.type?.name) ===
              false
            )
              continue
            this.rightFixedFields.push({
              sortField: child.props.sortField ?? '',
              label: child.props.label ?? '',
              width: child.props.width ?? 200,
              sortable: child.props.sortable ?? false
            })
          }
        }
      }
    }
  },
  mounted () {
    this.refreshLabels()
  }
}
</script>

<style lang="scss">
$transparent: rgba(0, 0, 0, 0);
$background: #fff;
$shadow: rgba(0, 0, 0, 0.3);

.table-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .header {
    flex-shrink: 0;
    padding: 25px;
    display: flex;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #030229;
    overflow: hidden;
    align-items: center;
    border: none;

    div {
      cursor: pointer;
      flex-shrink: 0;
      margin-right: 10px;
    }
  }

  .more-fields {
    flex-grow: 1;
    display: flex;
    overflow: auto;
    flex-shrink: 1 !important;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    align-items: center;

    &::-webkit-scrollbar {
      display: none;
    }

    > div {
      flex-shrink: 0;
      margin-right: 10px;
    }
  }

  .list {
    flex-grow: 1;
    overflow: auto;
  }

  .line {
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    overflow: hidden;
    align-items: center;
    padding: 0 25px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #1f1f1f;

    &.selected {
      box-shadow: -1px 2px 14px rgba(0, 0, 0, 0.1);
    }

    &.notselected {
      background: #f9f9f9;
    }

    .arrow {
      padding: 0;
      height: 33px;
      width: 33px;
      border: none;
      background: #f5f5f5;
      color: #a098ae;
      margin-left: 25px;
    }

    .more-fields {
      background: linear-gradient(to right, $background 5%, $transparent),
        linear-gradient(to right, $transparent, $background 95%) 0 100%,
        linear-gradient(to right, $shadow, $transparent 5%),
        linear-gradient(to left, $shadow, $transparent 5%);
      background-attachment: local, local, scroll, scroll;
      padding: 0;
    }

    > div,
    .more-fields > div {
      flex-shrink: 0;
      min-height: 60px;
      display: flex;
      align-items: center;
      text-align: left;
      margin-right: 10px;
    }
  }
}
</style>

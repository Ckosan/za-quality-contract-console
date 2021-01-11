<template>
  <div class="myEditor">
    <!--    <p>-->
    <!--      <el-button type="success" @click="RunResult" />-->
    <!--      <span class="theme" style="float:right">-->
    <!--        <el-select v-model="theme" size="mini" placeholder="请选择主题" @change="themeChange">-->
    <!--          <el-option-->
    <!--            v-for="item in themeOption"-->
    <!--            :key="item.value"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--      </span>-->
    <!--    </p>-->
    <div id="container" ref="child" style="height:600px" />
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'

export default {
  props: {
    codes: {
      type: String,
      default: function() {
        return '<div>请编辑html内容</div>'
      }
    },
    language: {
      type: String,
      default: function() {
        return 'java'
      }
    },
    editorOptions: {
      type: Object,
      default: function() {
        return {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false, // 只读
          cursorStyle: 'line', // 光标样式
          automaticLayout: false, // 自动布局
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 24, // 字体大小
          autoIndent: true// 自动布局
          // quickSuggestionsDelay: 500,   //代码提示延时
        }
      }
    }
  },
  data() {
    return {
      themeOption: [
        {
          value: 'vs',
          label: '默认'
        },
        {
          value: 'hc-black',
          label: '高亮'
        },
        {
          value: 'vs-dark',
          label: '深色'
        }
      ],
      theme: 'hc-black',
      codesCopy: null// 内容备份
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      const self = this
      self.$refs.child.innerHTML = ''
      self.monacoEditor = monaco.editor.create(self.$refs.child, {
        value: self.codesCopy || self.codes,
        language: self.language,
        theme: self.theme, // vs, hc-black, or vs-dark
        editorOptions: self.editorOptions
      })
      self.$emit('onMounted', self.monacoEditor)// 编辑器创建完成回调
      self.monacoEditor.onDidChangeModelContent(function(event) { // 编辑器内容changge事件
        self.codesCopy = self.monacoEditor.getValue()
        self.$emit('onCodeChange', self.monacoEditor.getValue(), event)
      })
      // 编辑器随窗口自适应
      window.addEventListener('resize', function() {
        self.initEditor()
      })
    },
    RunResult() {
      console.log(this.monacoEditor.getValue())
      return this.monacoEditor.getValue()
    },
    setValue(value) {
      this.monacoEditor.setValue(value)
    },
    themeChange(val) {
      this.initEditor()
    }
  }
}
</script>
<style scoped>
  #container {
    height: 100%;
    text-align: left;
  }
</style>

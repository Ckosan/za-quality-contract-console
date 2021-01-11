import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Select,
  Button,
  Table,
  TableColumn,
  Form,
  Option,
  OptionGroup,
  FormItem,
  Tabs,
  Tree,
  TabPane,
  Tag,
  Alert,
  Row,
  Col,
  Transfer,
  Tooltip,
  Loading,
  MessageBox,
  Message,
  Notification,
  TimePicker,
  DatePicker,
  Upload,
  Cascader,
  Collapse,
  CollapseItem,
  Autocomplete
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small' }

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Transfer)
Vue.use(Tooltip)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Autocomplete)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

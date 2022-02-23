new Vue({
  el: '#app',
  data() {
      return {
        columns: [
          { name: 'name', required: true, label: 'ФИО', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true },
          { name: 'telephone', align: 'center', label: 'Телефон', field: 'telephone' },
          { name: 'role', label: 'Кем приходится', field: 'role', align: 'center' },
          { name: 'actionButtons', label: 'Кнопки действий', field: 'carbs', align: 'center' },
        ],
        data: [
          {
            name: 'Тест Тестов Тестович',
            telephone: '8(800)555-35-35',
            role: 'Банк',
            isEditing: false,
            id: 0,
          },
          {
            name: 'Тест Тестов Тестович',
            telephone: '8(800)555-35-35',
            role: 'Друг',
            isEditing: false,
            id: 1,
          },
          {
            name: 'Тест Тестов Тестович',
            telephone: '8(800)555-35-35',
            role: 'Брат',
            isEditing: false,
            id: 2,
          },
          {
            name: 'Тест Тестов Тестович',
            telephone: '8(800)555-35-35',
            role: 'Одногруппник',
            isEditing: false,
            id: 3,
          },
        ],
          confirm: false,
          name: '',
          tel: '',
          rol: '',
      }
  },
  methods: {
      removeData(row){
          this.data = this.data.filter(item => {
            return item.id !== row.id
          })
        },
      onReset () {
          this.name = '';
          this.tel = '';
          this.rol = '';
        },
        onSubmit () {
          if (this.name.length > 0 && this.tel > 0 && this.rol > 0) {
            obj = {name: this.name, telephone: this.tel, role: this.rol, isEditing: false,};
            obj.id = (this.data[this.data.length-1] === undefined) ? 0 : this.data[this.data.length-1].id +1;
            this.data.push(obj);
            this.confirm = false;
          };
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Контакт успешно добавлен',
            }),
            this.name = '';
            this.tel = '';
            this.rol = '';
        },
        activateEditing(obj) {
          obj.isEditing = true;
          this.name = obj.name;
          this.tel = obj.telephone;
          this.rol = obj.role;
        },
        deActivateEditing(obj) {
          obj.isEditing = false;
          this.name = '';
          this.tel = '';
          this.rol = '';
        },
        changeContact(obj) {
          obj.name = this.name;
          obj.telephone = this.tel;
          obj.role = this.rol;
        },
  },
  mounted() {    
  },
  template: `
  <div class="q-pa-md">
    <q-table
      title="Телефонная книга"
      :data="data"
      :columns="columns"
      row-key="name"
      no-data-label="В телефонной книге пока нет номеров. Добавьте первый!">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
          <div style="display:flex; justify-content:center;">
            <span v-show="!props.row.isEditing"> {{ props.row.name }} </span>
            <span v-show="props.row.isEditing"><q-input v-model="name"></q-input></span>
          </div>
          </q-td>
          <q-td key="telephone" :props="props">
            <div style="display:flex; justify-content:center;">
              <span v-show="!props.row.isEditing"> {{ props.row.telephone }} </span>
              <span v-show="props.row.isEditing"><q-input v-model="tel"></q-input></span>
            </div>
          </q-td>
          <q-td key="role" :props="props">
            <div style="display:flex; justify-content:center;">
              <span v-show="!props.row.isEditing"> {{ props.row.role }} </span>
              <span v-show="props.row.isEditing"><q-input v-model="rol"></q-input></span>
            </div>
          </q-td>
          <q-td key="actionButtons" :props="props" style="width:300px;">
            <span v-show="!props.row.isEditing"><q-btn class="q-mr-sm" size="10px" color="orange" icon="edit" label="Изменить" @click="activateEditing(props.row)"></q-btn></span>
            <span v-show="props.row.isEditing"><q-btn class="q-mr-sm" size="10px" color="green" icon="save" label="Сохранить" @click="changeContact(props.row), deActivateEditing(props.row)"></q-btn></span>
            <span v-show="!props.row.isEditing"><q-btn size="10px" color="red" icon="delete" label="Удалить" @click="removeData(props.row)"></q-btn></span>
            <span v-show="props.row.isEditing"><q-btn size="10px" color="red" icon="cancel" label="Отменить" @click="deActivateEditing(props.row)"></q-btn></span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div style="display:flex; justify-content: center; margin-top: 20px;">
    <q-btn
      color="secondary"
      icon-left="add"
      label="Добавить новый контакт"
      size = "15px"
      @click="confirm = true">
    </q-btn>
  </div>

  <q-dialog v-model="confirm" persistent>
      <q-card>

      <div class="q-pa-md" style="max-width: 400px">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="name"
          placeholder="Иванов Иван Иванович"
          hint="ФИО"
          lazy-rules
          required
          :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
          </q-input>

        <q-input
          filled
          type="tel"
          v-model="tel"
          placeholder="8(ХХХ)ХХХ-ХХ-ХХ"
          hint="Номер телефона"
          lazy-rules
          required
          :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
        </q-input>

        <q-input
          filled
          v-model="rol"
          placeholder="Друг"
          hint="Кем приходится"
          lazy-rules
          required
          :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
        </q-input>

        <q-card-actions align="right">
          <q-btn flat label="Добавить" color="primary"  type="submit"></q-btn>
          <q-btn flat label="Очистить" color="primary" type="reset"></q-btn>
          <q-btn flat label="Отмена" color="primary" type="reset" v-close-popup></q-btn>
        </q-card-actions>
      </q-form>

    </div>
      </q-card>
    </q-dialog>
  </div>
  `
})
new Vue({
  el: '#app',
  data: {
    columns: [
      { name: 'name', required: true, label: 'ФИО', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true },
      { name: 'telephone', align: 'center', label: 'Телефон', field: 'telephone' },
      { name: 'role', label: 'Кем приходится', field: 'role', align: 'center' },
      { name: 'actionButtons', label: 'Кнопки действий', field: 'carbs', align: 'center' },
    ],
    data: [],
    confirm: false,
    name: '',
    tel: '',
    role: '',
    actionButton: 'Insert',
  },
  methods: {
      //Добавляем контакт в БД
      addContact() {
        axios.post('server.php', {
          action: 'insert',
          name: this.name,
          tel: this.tel,
          role: this.role,
        }).then((repsonse) => {
          this.confirm = false;
          this.name = '';
          this.tel = '';
          this.role = '';
          this.fetchAllContacts();
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Контакт успешно добавлен',
          });
        });
      },

      //Удаляем контакт из БД
      removeContact(id) {
        axios.post('server.php', {
          action: 'delete',
          id: id,
        }).then((response) => {
          this.fetchAllContacts();
        })
      },

      //Редактируем контакт в БД
      updateContact(obj) {
        axios.post('server.php', {
          action: 'update',
          name: this.name,
          tel: this.tel,
          role: this.role,
          id: obj.id,
        }).then((response) => {
          this.fetchSingleContact(obj);
          this.deActivateEditing(obj);
        })
      },
      //Включаем режим редактирования контакта
      activateEditing(obj) {
        obj.isEditing = true;
        this.name = obj.name;
        this.tel = obj.tel;
        this.role = obj.role;
      },
      //Отключаем режим редактирования контакта
      deActivateEditing(obj) {
        obj.isEditing = false;
        this.name = '';
        this.tel = '';
        this.role = '';
      },
      //Получаем изменненный контакт из БД
      fetchSingleContact(obj) {
        axios.post('server.php', {
          action: 'fetchSingle',
          id: obj.id,
        }).then((response) => {
          obj = Object.assign(obj, response.data);
        })
      },
      //Получаем все контакты из БД 
      fetchAllContacts(){
        axios.post('server.php', {
        action:'fetchall'
        }).then((response) => {
        this.data = response.data;
        });
      },
  },
  //При формировании приложения получаем все контакты из ДБ
  mounted() {
    this.fetchAllContacts();
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
          <span v-show="!props.row.isEditing"> {{ props.row.tel }} </span>
          <span v-show="props.row.isEditing"><q-input v-model="tel"></q-input></span>
        </div>
      </q-td>
      <q-td key="role" :props="props">
        <div style="display:flex; justify-content:center;">
          <span v-show="!props.row.isEditing"> {{ props.row.role }} </span>
          <span v-show="props.row.isEditing"><q-input v-model="role"></q-input></span>
        </div>
      </q-td>
      <q-td key="actionButtons" :props="props" style="width:300px;">

        <!-- Меняем кнопки в зависимости от того происходит редактирование или нет !-->
        
        <span v-show="!props.row.isEditing"><q-btn class="q-mr-sm" size="10px" color="orange" icon="edit" label="Изменить" @click="activateEditing(props.row)"></q-btn></span>
        <span v-show="props.row.isEditing"><q-btn class="q-mr-sm" size="10px" color="green" icon="save" label="Сохранить" @click="updateContact(props.row)"></q-btn></span>
        <span v-show="!props.row.isEditing"><q-btn size="10px" color="red" icon="delete" label="Удалить" @click="removeContact(props.row.id)"></q-btn></span>
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
      @click="confirm = true, actionButton = 'Insert'">
    </q-btn>
  </div>

  <!-- Модальное окно добавления контакта !-->

  <q-dialog v-model="confirm" persistent>
      <q-card>
        <div class="q-pa-md" style="max-width: 400px">
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
            v-model="role"
            placeholder="Друг"
            hint="Кем приходится"
            lazy-rules
            required
            :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
          </q-input>

          <q-card-actions align="right">
            <q-btn flat label="Добавить" color="primary"  v-model="actionButton" @click="addContact"></q-btn>
            <q-btn flat label="Очистить" color="primary" type="reset"></q-btn>
            <q-btn flat label="Отмена" color="primary" type="reset" v-close-popup></q-btn>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </div>
  `
})
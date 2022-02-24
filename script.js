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
  },
  methods: {
      //Добавляем контакт в БД
      addContact() {
        try {
          axios.post('server.php', {
            action: 'insert',
            name: this.name,
            tel: this.tel,
            role: this.role,
          }).then((response) => {
            if (response.data.STATUS === "N") {
              this.triggerServerNegative ();
            } else {
              this.confirm = false;
              this.onReset();
              this.fetchAllContacts();
              this.triggerPositive();
            }
          });
        } catch(err) {
          this.triggerNegative();
        }
      },
      //Удаляем контакт из БД
      removeContact(id) {
        try {
          axios.post('server.php', {
            action: 'delete',
            id: id,
          }).then((response) => {
            if (response.data.STATUS === "N") {
              this.triggerServerNegative ();
            } else {
            this.fetchAllContacts();
            this.triggerPositive();
            }
          });
        } catch(err) {
          this.triggerNegative(); 
        }
      },

      //Редактируем контакт в БД
      updateContact(obj) {
        try {
          axios.post('server.php', {
            action: 'update',
            name: this.name,
            tel: this.tel,
            role: this.role,
            id: obj.id,
          }).then((response) => {
            if (response.data.STATUS === "N") {
              this.triggerServerNegative ();
            } else {
            this.fetchSingleContact(obj);
            this.deActivateEditing(obj);
            this.triggerPositive();
            }
          })
        } catch(err) {
          this.triggerNegative();
        }
      },
      //Включаем режим редактирования контакта
      activateEditing(obj) {
        obj.isEditing = true;
        this.name = obj.name;
        this.tel = obj.tel;
        this.role = obj.role;
        this.edit = true;
      },
      //Отключаем режим редактирования контакта
      deActivateEditing(obj) {
        obj.isEditing = false;
        this.onReset();
        this.edit = false;
      },
      //Получаем изменненный контакт из БД
      fetchSingleContact(obj) {
        try {
          axios.post('server.php', {
            action: 'fetchSingle',
            id: obj.id,
          }).then((response) => {
            if (response.data.STATUS === "N") {
              this.triggerServerNegative ();
            } else {
            obj = Object.assign(obj, response.data);
            }
          })
        } catch(err) {
          this.triggerNegative();
        }
      },
      //Получаем все контакты из БД 
      fetchAllContacts(){
        try {
          axios.post('server.php', {
          action:'fetchall'
          }).then((response) => {
          if (response.data.STATUS === "N") {
            this.triggerServerNegative ();
          } else {
            this.data = response.data;
          }
          });
        } catch(err) {
          this.triggerNegative();
        }
      },
      //Чистим поля модального окна
      onReset() {
        this.name = '';
        this.tel = '';
        this.role = '';
      },
      //Уведомление об успешной операции
      triggerPositive () {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Операция выполнена успешно.',
      });
      },
      //Уведомление при ошибке
      triggerNegative () {
        this.$q.notify({
          type: 'negative',
          message: `Ошибка! Операция не была выполнена!`
        })
      },
      //Уведомление при ошибке на стороне сервера
      triggerServerNegative () {
        this.$q.notify({
          type: 'negative',
          message: `Ошибка на стороне сервера!`,
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
      <div class="flex-center">
        <span v-show="!props.row.isEditing"> {{ props.row.name }} </span>
        <span v-show="props.row.isEditing"><q-input v-model="name"></q-input></span>
      </div>
      </q-td>
      <q-td key="telephone" :props="props">
        <div class="flex-center">
          <span v-show="!props.row.isEditing"> {{ props.row.tel }} </span>
          <span v-show="props.row.isEditing"><q-input v-model="tel"></q-input></span>
        </div>
      </q-td>
      <q-td key="role" :props="props">
        <div class="flex-center">
          <span v-show="!props.row.isEditing"> {{ props.row.role }} </span>
          <span v-show="props.row.isEditing"><q-input v-model="role"></q-input></span>
        </div>
      </q-td>
      <q-td key="actionButtons" :props="props" style="width:300px;">

        <!-- Меняем кнопки в зависимости от того происходит редактирование или нет !-->

        <template v-if="!props.row.isEditing">
          <span ><q-btn class="q-mr-sm" size="10px" color="orange" icon="edit" label="Изменить" @click="activateEditing(props.row)"></q-btn></span>
          <span ><q-btn size="10px" color="red" icon="delete" label="Удалить" @click="removeContact(props.row.id)"></q-btn></span>
        </template>

        <template v-else>
          <span><q-btn class="q-mr-sm" size="10px" color="green" icon="save" label="Сохранить" @click="updateContact(props.row)"></q-btn></span>
          <span><q-btn size="10px" color="red" icon="cancel" label="Отменить" @click="deActivateEditing(props.row)"></q-btn></span>
        </template>

      </q-td>
    </q-tr>
  </template>
  <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center q-gutter-sm">
        <span>
          {{ message }}
        </span>
      </div>
    </template>
</q-table>

    <div class="flex-center row q-mt-lg">
    <q-btn
      color="secondary"
      icon-left="add"
      label="Добавить новый контакт"
      size = "15px"
      @click="confirm = true, onReset">
    </q-btn>
  </div>

  <!-- Модальное окно добавления контакта !-->

  <q-dialog v-model="confirm" persistent>
      <q-card  style="width: 600px; height: 400px;" class="flex-center row items-center">
        <div class="q-pa-md">
          <q-input
            filled
            v-model="name"
            placeholder="Иванов Иван Иванович"
            label="ФИО"
            lazy-rules
            required
            style="width: 450px"
            :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
          </q-input>

          <q-input
            filled
            type="tel"
            v-model="tel"
            placeholder="8(ХХХ)ХХХ-ХХ-ХХ"
            label="Номер телефона"
            lazy-rules
            required
            :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
          </q-input>

          <q-input
            filled
            v-model="role"
            placeholder="Друг"
            label="Кем приходится"
            lazy-rules
            required
            :rules="[ val => val && val.length > 0 || 'Пожалуйста заполните поле']">
          </q-input>

          <q-card-actions align="right">
            <q-btn flat label="Добавить" color="primary" @click="addContact"></q-btn>
            <q-btn flat label="Очистить" color="primary" @click="onReset"></q-btn>
            <q-btn flat label="Отмена" color="primary" @click="onReset" v-close-popup></q-btn>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </div>
  `
})
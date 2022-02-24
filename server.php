<?php

//Подключаемся к ДБ
try {
    $connect = new PDO("mysql:host=localhost;dbname=phonebook", "root", "");
} catch(PDOException $e) {
    echo "Ошибка соединения с базой данных" . $e->getMessage();
}
$received_data = json_decode(file_get_contents("php://input"));
$data = array();

//Определяем какое действие нужно сделать

switch($received_data->action) {
    case 'fetchall': //Передать на фронт все контакты из ДБ
        $query = "
            SELECT * FROM contacts 
            ORDER BY id DESC
        ";
        $statement = $connect->prepare($query);
        $statement->execute();
        while($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'insert': //Добавить новый контакт в ДБ, полученный с фронта
        $data = array(
        ':name' => $received_data->name,
        ':tel' => $received_data->tel,
        ':role' => $received_data->role,
        );

        $query = "
            INSERT INTO contacts 
            (name, tel, role) 
            VALUES (:name, :tel, :role)
        ";

        $statement = $connect->prepare($query);

        $statement->execute($data);

        $output = array(
            'message' => 'Data Inserted'
        );

        echo json_encode($output);
        break;
    
    case 'fetchSingle': //Передать обновленный контакт, полученный с фронта, в ДБ
        $query = "
            SELECT * FROM contacts 
            WHERE id = '".$received_data->id."'
        ";
        $statement = $connect->prepare($query);
        $statement->execute();
        $result = $statement->fetchAll();

        foreach($result as $row)
        {
            $data['id'] = $row['id'];
            $data['name'] = $row['name'];
            $data['tel'] = $row['tel'];
            $data['role'] = $row['role'];
        }
        echo json_encode($data);
        break;

    case 'update': //Обновить контакт в ДБ
        $data = array(
            ':name' => $received_data->name,
            ':tel' => $received_data->tel,
            ':role' => $received_data->role,
            ':id' => $received_data->id,
        );

        $query = "
            UPDATE contacts 
            SET name = :name, 
            tel = :tel,
            role = :role
            WHERE id = :id
        ";

        $statement = $connect->prepare($query);
        $statement->execute($data);
        $output = array(
            'message' => 'Data Updated'
        );
        echo json_encode($output);
        break;

    case 'delete': //Удалить контакт из ДБ
        $query = "
            DELETE FROM contacts 
            WHERE id = '".$received_data->id."'
        ";
        $statement = $connect->prepare($query);
        $statement->execute();
        $output = array(
        'message' => 'Data Deleted'
        );
        echo json_encode($output);
        break;
}

?>

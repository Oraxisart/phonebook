<?php

$data = array();
//Подключаемся к ДБ
try {
    $connect = new PDO("mysql:host=localhost;dbname=phonebook", "root", "");
} catch(PDOException $e) {
    echo json_encode(array("STATUS" => "N"));
    die();
}
$received_data = json_decode(file_get_contents("php://input"));

//Определяем какое действие нужно сделать

switch($received_data->action) {
    //Передать на фронт все контакты из ДБ
    case 'fetchall':
        try {
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
        } catch (PDOException $e) {
            echo json_encode(array(
                "STATUS" => "N",
            ));
            die();
        }

    //Добавить новый контакт в ДБ, полученный с фронта
    case 'insert':
        try {
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
            break;
        } catch (PDOException $e) {
            echo json_encode(array(
                "STATUS" => "N",
            ));
            die();
        }

    //Передать обновленный контакт, полученный с фронта, в ДБ
    case 'fetchSingle': 
        try {
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
        } catch (PDOException $e) {
            echo json_encode(array(
                "STATUS" => "N",
            ));
            die();
        }

    //Обновить контакт в ДБ
    case 'update':
        try {
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
            break;
        } catch (PDOException $e) {
            echo json_encode(array(
                "STATUS" => "N",
            ));
            die();
        }
    //Удалить контакт из ДБ
    case 'delete':
        try {
            $query = "
                DELETE FROM contacts 
                WHERE id = '".$received_data->id."'
            ";
            $statement = $connect->prepare($query);
            $statement->execute();
            break;
        } catch (PDOException $e) {
            echo json_encode(array(
                "STATUS" => "N",
            ));
            die();
        }
}

?>

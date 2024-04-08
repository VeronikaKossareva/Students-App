# Управление списком студентов

Это веб-приложение предназначено для управления списком студентов. Вы можете добавлять новых студентов, удалять неактуальные записи, а также сортировать и фильтровать существующий список. Список студентов сохраняется на сервере для последующего доступа.

## Установка и запуск

Перед запуском убедитесь, что вы установили Node.js версии 12 или выше.

1. Клонируйте репозиторий на свой локальный компьютер:

git clone https://github.com/VeronikaKossareva/Students-App.git

2. Важно разделить папку запуска сервера (backend) и клиентской части (frontend). Запустите папку сервера, как отдельный проект и отельно папку клиентской части.

3. Перейдите в директорию backend и запустите сервер:
```bash  
node index
```
4. Перейдите в директорию frontend, установите зависимости и запустите клиентскую часть:
```bash 
npm install
npm start
```

После этого приложение будет доступно по адресу http://localhost:3000/.

## Использование

### Добавление студента

Чтобы добавить нового студента, заполните форму на странице и нажмите кнопку "Добавить студента". Обязательно заполните все поля формы.

### Удаление студента

Чтобы удалить студента из списка, нажмите на кнопку "Удалить" рядом с его именем в таблице студентов.

### Сортировка студентов
Вы можете отсортировать список студентов по различным критериям, кликнув на заголовки столбцов. 

### Фильтрация студентов

Вы можете использовать форму фильтрации для поиска студентов по различным критериям, таким как имя, фамилия, отчество, факультет, год начала обучения и год окончания обучения.

## Технологии

- JavaScript
- HTML
- CSS
- Bootstrap




   




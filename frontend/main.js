/* eslint-disable max-len */

(async () => {
  // Функция для получения списка студентов с сервера
  async function getStudentsList() {
    // Отправляем запрос на сервер для получения списка студентов
    const studentsList = await fetch('http://localhost:3000/api/students').then(res => res.json()); // Преобразуем полученные данные в формат JSON
    return studentsList
  }

  // Форматирование даты рождения и вычисление возраста
  function getFormattedDate(date) {
    // Получаем день, месяц и год из объекта Date
    const birthDay = date.getDate();
    const birthMonth = date.getMonth() + 1; // Месяцы в объекте Date начинаются с 0, поэтому добавляем 1
    const birthYear = date.getFullYear();

    // Преобразуем числовые компоненты в строки и добавляем ведущие нули, если это необходимо
    const formattedDay = birthDay < 10 ? `0${birthDay}` : birthDay;
    const formattedMonth = birthMonth < 10 ? `0${birthMonth}` : birthMonth;

    // Собираем отформатированную дату в виде строки "dd.mm.yyyy"
    const formattedDate = `${formattedDay}.${formattedMonth}.${birthYear}`;

    // Получаем текущую дату
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Вычисляем возраст студента
    let age = currentYear - birthYear;

    // Проверяем, был ли день рождения в этом году
    const currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDay)) {
      age = currentYear - birthYear - 1;
    }

    // Определяем правильное склонение слова "год" в зависимости от возраста
    let slovo = '';
    if (age % 10 === 1 && age % 100 !== 11) {
      slovo = 'год';
    } else if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20)) {
      slovo = 'года';
    } else {
      slovo = 'лет';
    }

    // Возвращаем объект с отформатированной датой, возрастом и склонением слова "год"
    return {
      formattedDate,
      age,
      slovo,
    };
  }

  // Создание строки таблицы для одного студента
  function getStudentItem(studentObj) {
    const row = document.createElement('tr');

    // Создаем ячейку для ФИО студента
    const fullName = [studentObj.surname, studentObj.name, studentObj.lastname].join(' ');
    const cellFullName = `<td>${fullName}</td>`;

    // Создаем ячейку для факультета
    const cellFaculty = `<td>${studentObj.faculty}</td>`;

    // Получаем отформатированную дату рождения и возраст студента
    const birthDate = getFormattedDate(new Date(studentObj.birthday));
    const cellBirthDate = `<td>${birthDate.formattedDate} (${birthDate.age} ${birthDate.slovo})</td>`;

    // Создаем ячейку для указания периода обучения
    const startYear = Number(studentObj.studyStart);
    let studyYearsText;
    if (startYear + 4 < new Date().getFullYear() || (startYear + 4 === new Date().getFullYear() && new Date().getMonth() > 9)) {
      studyYearsText = `${startYear} - закончил/а`;
    } else if (new Date().getFullYear() === startYear && new Date().getMonth() < 9) {
      studyYearsText = `${startYear}-${startYear + 4}  (1 курс)`;
    } else {
      studyYearsText = `${startYear}-${startYear + 4}  (${new Date().getFullYear() - startYear} курс)`;
    }
    const cellStudyYears = `<td>${studyYearsText}</td>`;

    // Создаем кнопку удаления
    const deleteButton = `<td class="button__delete">✖ Удалить</td>`;

    // Комбинируем все ячейки и добавляем их в строку
    const rowHTML = `${cellFullName}${cellFaculty}${cellBirthDate}${cellStudyYears}${deleteButton}`;
    row.innerHTML = rowHTML;

    return { row };
  }

  // Отрисовки таблицы со списком студентов
  (async () => {
    const studentsArray = await getStudentsList();

    // Находим контейнер, в который будем добавлять таблицу
    const container = document.querySelector('.table__wrap');

    // Создаем элемент таблицы
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover', 'table-condensed');

    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const deleteButtons = document.createElement('div');
    deleteButtons.classList.add('table__delete');

    // Для каждого заголовка столбца в массиве создаем элемент th и добавляем его в строку заголовка
    ['Ф. И. О.', 'Факультет', 'Дата рождения и возраст', 'Годы обучения', ''].forEach((columnTitle) => {
      const th = document.createElement('th');
      th.textContent = columnTitle;
      headerRow.append(th);
    });

    tableHead.append(headerRow);

    // Создаем элемент тела таблицы
    const tableBody = document.createElement('tbody');

    // Для каждого студента в массиве создаем элемент строки таблицы с данными студента
    for (const student of studentsArray) {
      tableBody.append(getStudentItem(student).row);
    }

    table.append(tableHead);
    table.append(tableBody);
    container.appendChild(table);
    container.append(deleteButtons);

    // Если список студентов пустой, скрываем таблицу
    if (studentsArray.length === 0) {
      table.style.display = 'none';
    }
  })();

  // Обновление таблицы студентов
  async function updateStudentsTable(arr) {
    const tbody = document.querySelector('tbody');
    tbody.textContent = ''; // Очистим содержимое tbody

    // Для каждого студента в переданном массиве создаем элемент строки таблицы с данными студента
    for (const student of arr) {
      tbody.append(getStudentItem(student).row);
    }
    // Привязываем обработчики удаления к кнопкам удаления
    attachDeleteHandlers(arr);
  }

  // Функция удаления студента
  async function deleteStudent(studentId) {
    // Отправляем запрос на удаление студента по его идентификатору
    await fetch(`http://localhost:3000/api/students/${studentId}`, {
      method: "DELETE"
    });

    // Получаем обновленный список студентов после удаления
    const students = await getStudentsList();

    attachDeleteHandlers(students); // Привязываем обработчики удаления к кнопкам удаления
    updateStudentsTable(students);  // Обновляем таблицу студентов

    // Если список студентов пуст, скрываем таблицу
    if (students.length === 0) {
      document.querySelector('table').style.display = 'none';
    }
  }

  // Привязка обработчиков событий удаления к кнопкам удаления для списка студентов
  async function attachDeleteHandlers(studentsList) {
    // Находим все кнопки удаления
    const deleteButtons = document.querySelectorAll('.button__delete')
    // Для каждой кнопки удаления
    deleteButtons.forEach((button, index) => {
      // Добавляем обработчик события клика
      button.addEventListener('click', async () => {
        // Получаем ид студента из списка по индексу элемента, по которому был сделан клик
        const studentId = studentsList[index].id;
        // Показываем всплывающее окно для подтверждения удаления
        if (!confirm('Вы уверены?')) {
          return; // Если пользователь отменил удаление, выходим из функции
        }
        // Вызываем функцию удаления студента
        await deleteStudent(studentId);
      });
    });
  }

  // Привязываем обработчики удаления к кнопкам удаления для текущего списка студентов
  attachDeleteHandlers(await getStudentsList());

  // Получаем значения полей формы
  const firstNameInp = document.getElementById('first_name');
  const lastNameInp = document.getElementById('last_name');
  const patronymicInp = document.getElementById('patronymic_date');
  const birthDateInp = document.getElementById('birthdate');
  const startYearInp = document.getElementById('start_year');
  const facultyInp = document.getElementById('faculty_date');
  const form = document.getElementById('form');

  // Обработчик события отправки формы добавления студента
  form.addEventListener('submit', async e => {
    // Предотвращаем стандартное действие отправки формы
    e.preventDefault();

    // Получаем элемент для вывода ошибок
    const error = document.querySelector('.descr');
    // Получаем все поля ввода формы
    const inputFormAdd = document.querySelectorAll('.form-control');
    // Добавляем классы для стилизации ошибок
    error.classList.add('alert', 'alert-danger');

    // Создаем объект с данными нового студента, извлекая значения полей формы
    const newStudent = {
      name: firstNameInp.value.trim().charAt(0).toUpperCase() + firstNameInp.value.trim().slice(1),
      surname: lastNameInp.value.trim().charAt(0).toUpperCase() + lastNameInp.value.trim().slice(1),
      lastname: patronymicInp.value.trim().charAt(0).toUpperCase() + patronymicInp.value.trim().slice(1),
      birthday: new Date(birthDateInp.value.trim()),
      studyStart: Number(startYearInp.value.trim()),
      faculty: facultyInp.value.trim().charAt(0).toUpperCase() + facultyInp.value.trim().slice(1),
    };

    // Удаляем предыдущие сообщения об ошибках
    const errorsDescr = document.querySelectorAll('.descr__errors');
    errorsDescr.forEach((err) => {
      err.remove();
    });

    // Проверяем каждое поле на пустое значение
    inputFormAdd.forEach((input) => {
      if (input.value.trim() === '') {
        // Если поле пустое, создаем сообщение об ошибке
        const errorDescr = document.createElement('p');
        errorDescr.classList.add('descr__errors');

        if (input.id === 'first_name') {
          errorDescr.textContent = 'Заполните поле с именем';
          error.append(errorDescr);
        } else if (input.id === 'last_name') {
          errorDescr.textContent = 'Заполните поле с фамилией';
          error.append(errorDescr);
        } else if (input.id === 'patronymic_date') {
          errorDescr.textContent = 'Заполните поле с отчеством';
          error.append(errorDescr);
        } else if (input.id === 'birthdate') {
          errorDescr.textContent = 'Заполните поле с датой рождения';
          error.append(errorDescr);
        } else if (input.id === 'start_year') {
          errorDescr.textContent = 'Заполните поле с годом начала обучения';
          error.append(errorDescr);
        } else if (input.id === 'faculty_date') {
          errorDescr.textContent = 'Заполните поле с факультетом';
          error.append(errorDescr);
        }
      }
    });

    // Проверяем дату рождения на корректность
    if (!Number.isNaN(newStudent.birthday.getTime())
      && ((newStudent.birthday.getFullYear() < 1900
        || newStudent.birthday.getFullYear() > new Date().getFullYear()
        || (newStudent.birthday.getFullYear() === new Date().getFullYear()
          && newStudent.birthday.getMonth() >= new Date().getMonth()
          && newStudent.birthday.getDate() >= new Date().getDate())))) {
      const errorDescr = document.createElement('p');
      errorDescr.classList.add('descr__errors');
      errorDescr.textContent = 'Дата рождения должна находиться в диапазоне от 01.01.1900 до текущей даты';
      error.append(errorDescr);
    }

    // Проверяем год начала обучения на корректность
    if (newStudent.studyStart !== 0
      && (newStudent.studyStart < 2000
        || newStudent.studyStart > new Date().getFullYear())) {
      const errorDescr = document.createElement('p');
      errorDescr.classList.add('descr__errors');
      errorDescr.textContent = 'Год начала обучения должен находиться в диапазоне от 2000-го до текущего года';
      error.append(errorDescr);
    }

    // Проверяем, есть ли сообщения об ошибках
    if (document.querySelectorAll('.descr__errors').length === 0) {
      error.classList.remove('alert', 'alert-danger'); // Если ошибок нет, удаляем классы для стилизации ошибок

      await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      form.reset(); // Очищаем форму
      updateStudentsTable(await getStudentsList()); // Обновляем таблицу студентов

      document.querySelector('table').style.display = 'table'; // Делаем таблицу видимой
    }
  });

  // Сортировка списка студентов
  async function sortStudents(prop, dir) {
    const listCopy = [...await getStudentsList()];

    listCopy.sort((a, b) => {
      if (!dir) {
        // Сортировка по возрастанию, если dir равен false
        return a[prop] < b[prop] ? -1 : 1;
      }
      // Сортировка по убыванию, если dir равен true
      return a[prop] > b[prop] ? -1 : 1;
    });

    // Обновление таблицы студентов после сортировки
    updateStudentsTable(listCopy);
  }

  // Обработчики событий для сортировки по колонкам
  let flag = false;
  const thList = document.querySelectorAll('th');

  // Обработчики кликов на заголовки столбцов
  thList.forEach((th) => {
    th.addEventListener('click', () => {
      if (th.textContent === 'Ф. И. О.') {
        sortStudents('surname', flag);
        flag = !flag;
      } else if (th.textContent === 'Факультет') {
        sortStudents('faculty', flag);
        flag = !flag;
      } else if (th.textContent === 'Дата рождения и возраст') {
        sortStudents('birthday', flag);
        flag = !flag;
      } else if (th.textContent === 'Годы обучения') {
        sortStudents('studyStart', flag);
        flag = !flag;
      }
    });
  });

  // Функция фильтрации студентов
  function filter(arrey, prop, value) {
    const arr = [];
    // Создаем копию исходного массива для безопасной работы с данными
    const arrCopy = [...arrey];

    // Итерируемся по копии массива студентов
    for (const item of arrCopy) {
      // Проверяем условия фильтрации в зависимости от свойства
      if ((prop === 'finishYear' && Number(item.studyStart) + 4 === value)
        || (prop === 'startYear' && Number(item.studyStart) === value)) {
        arr.push(item);
      } else if (prop === 'fio') {
        // Если фильтрация по ФИО, создаем массив из ФИО студента и проверяем наличие значения
        const fio = [item.surname, item.name, item.lastname];

        if (fio.includes(value)) {
          arr.push(item);
        }
      } else if (item[prop] === value) {
        // Если фильтрация по другому свойству, сравниваем его значение с заданным
        arr.push(item);
      }
    }
    // Возвращаем отфильтрованный массив студентов
    return arr;
  }

  // Получаем форму фильтрации, пустой элемент для вывода сообщения о результате и контейнер таблицы
  const filterForm = document.querySelector('.form__filter');
  const noResult = document.createElement('p');
  const tableContainer = document.querySelector('.table__wrap');
  const table = document.querySelector('.table');

  // Устанавливаем текст сообщения о пустом результате и стилизуем его
  noResult.textContent = 'Поиск не дал результатов';
  noResult.style.fontSize = '1rem';

  // Добавляем сообщение о пустом результате в контейнер таблицы и скрываем его
  tableContainer.append(noResult);
  noResult.style.display = 'none';

  // Обработчик события отправки формы фильтрации
  filterForm.addEventListener('submit', async (e) => {
    // Предотвращаем стандартное поведение формы
    e.preventDefault();
    // Получаем все поля ввода формы
    const inputForm = document.querySelectorAll('.form__input');
    const objForFilter = [];

    // Итерируемся по всем полям ввода формы
    inputForm.forEach((input) => {
      // Если значение поля не пустое
      if (input.value) {
        // Обрабатываем значение в зависимости от типа поля
        const value = input.value.trim().charAt(0).toUpperCase() + input.value.trim().slice(1);

        // Если поле относится к году начала или окончания обучения, преобразуем его в число
        if (input.id === 'startYear' || input.id === 'finishYear') {
          objForFilter.push({ inputValue: Number(value), inputId: input.id });
        } else if (input.id === 'fio') {
          // Если поле относится к ФИО, разделяем его на компоненты и преобразуем первую букву каждого слова в верхний регистр
          const valuesArray = input.value.trim().split(' ');
          valuesArray.forEach((fioValue) => {
            objForFilter.push({ inputValue: fioValue.charAt(0).toUpperCase() + fioValue.slice(1), inputId: input.id });
          });
        } else {
          // Если поле относится к другим свойствам, преобразуем его значение в верхний регистр
          objForFilter.push({ inputValue: value, inputId: input.id });
        }
      }
    });

    // Инициализируем переменную для хранения отфильтрованных студентов
    const studentsList = await getStudentsList();
    let filteredStudents;

    // Проверяем, есть ли фильтры
    if (objForFilter.length > 0) {
      let i = 1;
      filteredStudents = filter(studentsList, objForFilter[0].inputId, objForFilter[0].inputValue);

      // Фильтруем студентов по каждому критерию ввода
      while (i < objForFilter.length) {
        filteredStudents = filter(filteredStudents, objForFilter[i].inputId, objForFilter[i].inputValue);
        i++;
      }
    } else {
      // Если фильтры отсутствуют, отображаем всех студентов
      filteredStudents = studentsList;
    }

    // Если найдены студенты, обновляем таблицу
    if (filteredStudents.length > 0) {
      updateStudentsTable(filteredStudents);
    } else {
      // Если студенты не найдены, показываем сообщение о пустом результате и скрываем таблицу
      noResult.style.display = 'block';
      table.style.display = 'none';
    }
  });

  // Обработчик события сброса формы фильтрации
  filterForm.addEventListener('reset', async () => {
    // Показываем таблицу и скрываем сообщение о пустом результате
    table.style.display = 'table';
    noResult.style.display = 'none';
    // Обновляем таблицу, отображая всех студентов
    updateStudentsTable(await getStudentsList());
  });
})();

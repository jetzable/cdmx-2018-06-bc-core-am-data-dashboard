// Declaración de variables para llamar los contenedores de la página de acceso
let loginContainer = document.querySelector('#login-container');
let userName = document.querySelector('#user-name');
let pwd = document.querySelector('#pwd');
let selectCampus = document.querySelector('#select-campus');
let selectGeneration = document.querySelector('#select-generation');
let loginButton = document.querySelector('#login-button');

// Declaración de variables para llamar los contenedores de la página inicial del Dashboard
let mainPage = document.querySelector('#main-page');
let selectCampusDashboard1 = document.querySelector('#select-campus-dashboard-1');
let selectCampusDashboard2 = document.querySelector('#select-campus-dashboard-2');
let selectGenerationDashboard1 = document.querySelector('#select-generation-dashboard-1');
let selectGenerationDashboard2 = document.querySelector('#select-generation-dashboard-2');
let exitButton1 = document.getElementById('exit-button-1');
let exitButton2 = document.getElementById('exit-button-2');
const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search');
let cajaDatosFiltrados = document.getElementById('data-section');
const changeData = document.getElementById('select2');
const changeDataMobile = document.getElementById('select1');
const buttonToOrder = document.getElementById('button-to-order');
const buttonToOrder2 = document.getElementById('button-to-order-2');


// Constante que guarda archivo json
const json = 'https://raw.githubusercontent.com/citlallidmg/cdmx-2018-06-bc-core-am-data-dashboard/master/data/laboratoria.json#';


// Función que obtiene data del archivo y pasa los datos a otras funciones.
const getData = () => {
  fetch(json)
    .then(response => response.json())
    .then((res) => {
      const campus = data.obtainCampus(res);
      const generationsData = data.obtainGeneration(res);
      const generations = computeGenerationsStats(res);
      const students = computeStudentsStats(res);
      drawCampus(campus, generationsData, generations, students);
      drawCampusDashboard(campus);
      drawGenerationDashboard(generationsData);
      getSearch(students);
      changeDashboard(generations, students);
      getOptionToOrder(students);
    })
    .catch((error) => {
      console.log(error);
    });
};


// Llamada a funcion para obtener data.
getData();

// Función que desplega opciones de campus y generaciones.
const drawCampus = (sedes, generaciones, generations, students) => {
  sedes.forEach((sede) => {
    const option = document.createElement('option');
    option.innerHTML = sede.toUpperCase();
    selectCampus.appendChild(option);
    selectCampus.addEventListener('change', quitDisabled);
  });

  generaciones.forEach((generacion) => {
    const option = document.createElement('option');
    option.innerHTML = generacion.toUpperCase();
    selectGeneration.appendChild(option);
  });

  loginButton.addEventListener('click', () => data.checkLogin(sedes, generaciones, generations, students)); // No es la mejor opción
};

const quitDisabled = () => {
  selectGeneration.disabled = false;
};


// Función que obtiene dato de búsqueda.
const getSearch = (students) => {
  let searchString = '';
  searchButton.addEventListener('click', (event) => {
    searchString = searchText.value;
    arrFilterStudent = filterStudents(students, searchString);
    printFilterStudent(arrFilterStudent);
  });
};


// Función que imprime datos del arreglo resultante de la búsqueda.
const printFilterStudent = (arrFilterStudent) => {
  if (arrFilterStudent.length === 0) {
    cajaDatosFiltrados.innerHTML = `<div class="well card">
        <div class="info">
            <h1>No hay coincidencias</h1>
        </div>
    </div>`;
  } else {
    let campus = document.getElementById('venue').innerText.toLowerCase();
    let generationValue = document.getElementById('generation').innerText.toLowerCase();
    let generationArray = generationValue.split(' ');
    let generation = generationArray[0];
    cajaDatosFiltrados.innerHTML = '';
    let studentMatch = ' ';

    for (i = 0; i < arrFilterStudent.length; i++) {
      if (campus === arrFilterStudent[i].campus && generation === arrFilterStudent[i].generation) {
        studentMatch += `<div class="well card">
                                <div class="info">
                                    <h3 id="name">${arrFilterStudent[i].name}</h3>
                                    <p>Correo: ${arrFilterStudent[i].email}</p>
                                    <p>Turno: ${arrFilterStudent[i].turn}</p>
                                    <p>Status: ${arrFilterStudent[i].stats['status']}</p>
                                    <p>Porcentaje Completado: ${arrFilterStudent[i].stats.completedPercentage}</p>
                            </div>
                        </div>`;
      }
      if (studentMatch === ' ' || studentMatch === null) {
        cajaDatosFiltrados.innerHTML = `<div class="well card">
                                                <div class="info">
                                                    <h1>No hay coincidencias</h1>
                                                </div>
                                            </div>`;
      } else {
        cajaDatosFiltrados.innerHTML = studentMatch;
      }
    }
  }
};


const changeDashboard = (generations, students) => {
  changeData.addEventListener('click', () => {
    let newCampus = (selectCampusDashboard2.value);
    let newGeneration = (selectGenerationDashboard2.value);
    let name = document.getElementById('user-2').innerText;
    welcomeDashboard(name, newCampus, newGeneration, generations, students);
    getTurno(newCampus, newGeneration, students);
  });
  changeDataMobile.addEventListener('click', () => {
    let newCampus = (selectCampusDashboard1.value);
    let newGeneration = (selectGenerationDashboard1.value);
    let name = document.getElementById('user-1').innerText;
    welcomeDashboard(name, newCampus, newGeneration, generations, students);
    getTurno(newCampus, newGeneration, students);
  });
};

const listStudentsCount = (students, venue, gen) => {
  let numberStudents = document.getElementById('student-first-count');
  numberStudents.addEventListener('click', (event) => {
    let estudiantesArr = [];
    let printStudentsList = ' ';
    for (i = 0; i < students.length; i++) {
      if (students[i].campus === venue && students[i].generation === gen) {
        estudiantesArr.push(students[i]);
        printStudentsList += `<div class="well card">
                <div class="info">
                    <h3 id="name">${students[i].name}</h3>
                    <p>Correo: ${students[i].email}</p>
                    <p>Turno: ${students[i].turn}</p>
                    <p>Status: ${students[i].stats['status']}</p>
                    <p>Porcentaje Completado: ${students[i].stats.completedPercentage}</p>
            </div>
        </div>`;
      }
      cajaDatosFiltrados.innerHTML = ' ';
      cajaDatosFiltrados.innerHTML = printStudentsList;
    }
    // getOptionToOrder(students);
  });
};

const listStudentsTurnoAm = (turno, arr) => {
  turno.addEventListener('click', (event) => {
    let printStudentsList = ' ';
    for (i = 0; i < arr.length; i++) {
      printStudentsList += `<div class="well card">
                    <div class="info">
                        <h3 id="name">${arr[i].name}</h3>
                        <p>Correo: ${arr[i].email}</p>
                </div>
            </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = printStudentsList;
  });
};

const listStudentsTurnoPm = (turno, arr) => {
  turno.addEventListener('click', (event) => {
    let printStudentsList = ' ';
    for (i = 0; i < arr.length; i++) {
      printStudentsList += `<div class="well card">
                            <div class="info">
                                <h3 id="name">${arr[i].name}</h3>
                                <p>Correo: ${arr[i].email}</p>
                        </div>
                    </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = printStudentsList;
  });
};

const listStudentsProgressBelow = (arr) => {
  document.getElementById('progress-bar-below').addEventListener('click', (event) => {
    let printStudentsList = ' ';
    for (i = 0; i < arr.length; i++) {
      printStudentsList += `<div class="well card">
            <div class="info">
                <h3 id="name">${arr[i].name}</h3>
                <p>Correo: ${arr[i].email}</p>
                <p>Turno: ${arr[i].turn}</p>
                <p>Porcentaje Completado: ${arr[i].stats.completedPercentage}</p>
        </div>
    </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = printStudentsList;
  });
};

const listStudentsProgressAverage = (arr) => {
  document.getElementById('progress-bar-average').addEventListener('click', (event) => {
    let printStudentsList = ' ';
    for (i = 0; i < arr.length; i++) {
      printStudentsList += `<div class="well card">
              <div class="info">
                  <h3 id="name">${arr[i].name}</h3>
                  <p>Correo: ${arr[i].email}</p>
                  <p>Turno: ${arr[i].turn}</p>
                  <p>Porcentaje Completado: ${arr[i].stats.completedPercentage}</p>
          </div>
      </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = printStudentsList;
  });
};

const listStudentsProgressAbove = (arr) => {
  document.getElementById('progress-bar-above').addEventListener('click', (event) => {
    let printStudentsList = ' ';
    for (i = 0; i < arr.length; i++) {
      printStudentsList += `<div class="well card">
              <div class="info">
                  <h3 id="name">${arr[i].name}</h3>
                  <p>Correo: ${arr[i].email}</p>
                  <p>Turno: ${arr[i].turn}</p>
                  <p>Porcentaje Completado: ${arr[i].stats.completedPercentage}</p>
          </div>
      </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = printStudentsList;
  });
};

// Función que despliega los datos a mostrar en la pantalla de inicio del Dashboard después del login
const welcomeDashboard = (name, sede, generation, generations, students) => {
  document.querySelector('#venue').innerHTML = sede;
  document.querySelector('#generation').innerHTML = `${generation} GENERACIÓN`;
  document.querySelector('#user-1').innerHTML = name.toUpperCase();
  document.querySelector('#user-2').innerHTML = name.toUpperCase();
  let venue = sede.toLowerCase();
  let gen = generation.toLowerCase();
  let estudiantes;
  for (let i = 0; i < generations.length; i++) {
    let campus = generations[i].campus;
    let generacion = generations[i].generation;
    if (campus === venue && generacion === gen) {
      estudiantes = generations[i].count;
    }
  }
  let firstDashboard = `<div class="row">
                          <!--Abre caja donde despliegan las estudiantes activas-->
                          <div class="col-sm-6 student-section">
                            <div class="well">
                              <h4>Estudiantes activas</h4>
                              <div id="lista"></div>
                            </div>
                          </div>

                          <!--Abre caja donde despliegan las estudiantes por turno-->
                          <div class="col-sm-6 student-section">
                            <div class="well">
                              <h4>Turno AM</h4>
                              <button id="turno-count-am" type="button"></button>
                              <h4>Turno PM</h4>
                              <button id="turno-count-pm" type="button"></button>
                            </div>
                          </div>

                        </div>

                        <!--Abre sección donde se despliega el avance en el LMS-->
                        <div class="panel panel-default">

                          <div class="panel-heading">
                            <h4>Avance en el LMS</h4>
                          </div>

                          <div class="panel-body">
                            <p>&#x25BC; 60%</p>
                            <!--Ejemplo de como meter una barra de progreso-->
                            <div class="progress" id="progress-bar-below" type="button">
                            </div>
                          </div>

                          <div class="panel-body">
                            <p>60% - 90%</p>
                            <div class="progress" id="progress-bar-average" type="button">
                            </div>
                          </div>

                          <div class="panel-body">
                            <p>&#x25B2; 90%</p>
                            <div class="progress" id="progress-bar-above" type="button">
                            </div>
                          </div>

                        </div>`;

  cajaDatosFiltrados.innerHTML = firstDashboard;
  const numberStudents = document.createElement('h3');
  numberStudents.setAttribute('id', 'student-first-count');
  numberStudents.setAttribute('type', 'button');
  numberStudents.innerHTML = estudiantes;
  document.getElementById('lista').appendChild(numberStudents);
  listStudentsCount(students, venue, gen);
  getProgress(sede, generation, students, estudiantes);
  return estudiantes;
};

// Función que determina el progreso de cada estudiante.
const getProgress = (venue, generation, students, studentsInVenue) => {
  let progressAbove = 0;
  let progressBelow = 0;
  let progressAverage = 0;
  let studentsBelow = [];
  let studentsAverage = [];
  let studentsAbove = [];
  let resultBelow = '';
  let resultAverage = '';
  let resultAbove = '';

  for (let i = 0; i < students.length; i++) {
    if (students[i].campus === venue.toLowerCase() && students[i].generation === generation.toLowerCase() && students[i].stats.status === 'below') {
      progressBelow++;
      studentsBelow.push(students[i]);
    } else if (students[i].campus === venue.toLowerCase() && students[i].generation === generation.toLowerCase() && students[i].stats.status === 'average') {
      progressAverage++;
      studentsAverage.push(students[i]);
    } else if (students[i].campus === venue.toLowerCase() && students[i].generation === generation.toLowerCase() && students[i].stats.status === 'over') {
      progressAbove++;
      studentsAbove.push(students[i]);
    }
  }
  resultBelow = `<div class="progress-bar" id="below-bar" role="progressbar" aria-valuenow="${progressBelow}" aria-valuemin="0" aria-valuemax="${studentsInVenue}" style="width:${(progressBelow * 100) / studentsInVenue}%">
                <p class="bar-text">${progressBelow}/${studentsInVenue}</p>          
              </div>`;
  document.getElementById('progress-bar-below').innerHTML = resultBelow;
  resultAverage = `<div class="progress-bar" id="average-bar" role="progressbar" aria-valuenow="${progressAverage}" aria-valuemin="0" aria-valuemax="${studentsInVenue}" style="width:${(progressAverage * 100) / studentsInVenue}%">
                <p class="bar-text">${progressAverage}/${studentsInVenue}</p>          
              </div>`;
  document.getElementById('progress-bar-average').innerHTML = resultAverage;
  resultAbove = `<div class="progress-bar" id="above-bar" role="progressbar" aria-valuenow="${progressAbove}" aria-valuemin="0" aria-valuemax="${studentsInVenue}" style="width:${(progressAbove * 100) / studentsInVenue}%">
                <p class="bar-text">${progressAbove}/${studentsInVenue}</p>          
              </div>`;
  document.getElementById('progress-bar-above').innerHTML = resultAbove;
  listStudentsProgressBelow(studentsBelow);
  listStudentsProgressAverage(studentsAverage);
  listStudentsProgressAbove(studentsAbove);
};

const drawCampusDashboard = (sedes, generations) => {
  sedes.forEach((sede) => {
    const option = document.createElement('option');
    option.innerHTML = sede.toUpperCase();
    selectCampusDashboard1.appendChild(option);
  });
  // Crea el dropdown de generaciones en el menú para la versión desktop
  sedes.forEach((sede) => {
    const option = document.createElement('option');
    option.innerHTML = sede.toUpperCase();
    selectCampusDashboard2.appendChild(option);
  });
};

const drawGenerationDashboard = (generations) => {
  for (let i = 0; i < generations.length; i++) {
    const option = document.createElement('option');
    const textOption = generations[i];
    option.innerHTML = textOption.toUpperCase();
    selectGenerationDashboard1.appendChild(option);
  }
  for (let i = 0; i < generations.length; i++) {
    const option = document.createElement('option');
    const textOption = generations[i];
    option.innerHTML = textOption.toUpperCase();
    selectGenerationDashboard2.appendChild(option);
  }
};

// Funcion para comparar turno de estudiante, retorna conteo y arreglo
const getTurno = (venue, generation, students) => {
  let valores = Object.values(students);
  let arrPM = [];
  let arrAM = [];
  let turnoAM = 0;
  let turnoPM = 0;
  for (turn of valores) {
    let minusculasVenue = venue.toLowerCase();
    let minusculasGeneration = generation.toLowerCase();
    if (minusculasVenue === turn.campus) {
      if (turn.generation === minusculasGeneration) {
        if (turn.turn === 'PM') {
          arrPM.push({
            'name': turn.name,
            'email': turn.email
          });
          turnoPM++;
        } else {
          arrAM.push({
            'name': turn.name,
            'email': turn.email
          });
          turnoAM++;
        }
      }
    };
  }
  let turnoAmBox = document.getElementById('turno-count-am');
  let turnoPmBox = document.getElementById('turno-count-pm');
  turnoAmBox.innerHTML = turnoAM;
  turnoPmBox.innerHTML = turnoPM;
  listStudentsTurnoAm(turnoAmBox, arrAM);
  listStudentsTurnoPm(turnoPmBox, arrPM);
};

const getOptionToOrder = (students) => {
  buttonToOrder.addEventListener('click', (event) => {
    const selectOrderBy = document.getElementById('order-by').value;
    const selectOrder = document.getElementById('asc-dsc').value;
    let ordenados = sortStudents(students, selectOrderBy, selectOrder);
    let studentsOrder = ' ';
    for (i = 0; i < ordenados.length; i++) {
      studentsOrder += `<div class="well card">
                                <div class="info">
                                    <h3 id="name">${ordenados[i].name}</h3>
                                    <p>Correo: ${ordenados[i].email}</p>
                                    <p>Sede: ${ordenados[i].campus}</p>
                                    <p>Generación: ${ordenados[i].generation}</p>
                                    <p>Turno: ${ordenados[i].turn}</p>
                                    <p>Status: ${ordenados[i].stats['status']}</p>
                                    <p>Porcentaje Completado: ${ordenados[i].stats.completedPercentage}</p>
                            </div>
                        </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = studentsOrder;
  });

  buttonToOrder2.addEventListener('click', (event) => {
    const selectOrderBy = document.getElementById('order-by-1').value;
    const selectOrder = document.getElementById('asc-dsc-1').value;
    let ordenados = sortStudents(students, selectOrderBy, selectOrder);
    let studentsOrder = ' ';
    for (i = 0; i < ordenados.length; i++) {
      studentsOrder += `<div class="well card">
                                <div class="info">
                                    <h3 id="name">${ordenados[i].name}</h3>
                                    <p>Correo: ${ordenados[i].email}</p>
                                    <p>Sede: ${ordenados[i].campus}</p>
                                    <p>Generación: ${ordenados[i].generation}</p>
                                    <p>Turno: ${ordenados[i].turn}</p>
                                    <p>Status: ${ordenados[i].stats['status']}</p>
                                    <p>Porcentaje Completado: ${ordenados[i].stats.completedPercentage}</p>
                            </div>
                        </div>`;
    }
    cajaDatosFiltrados.innerHTML = ' ';
    cajaDatosFiltrados.innerHTML = studentsOrder;
  });
};

exitButton1.addEventListener('click', (event) => {
  if (confirm('¿Salir de <LAB-Dash>?')) {
    window.location.reload();
  };
});

exitButton2.addEventListener('click', (event) => {
  if (confirm('¿Salir de <LAB-Dash>?')) {
    window.location.reload();
  };
});
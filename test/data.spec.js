describe('data', () => {
  it('debería exponer función computeStudentsStats en objeto global', () => {
    assert.isFunction(computeStudentsStats);
  });

  it('debería exponer función computeGenerationsStats en objeto global', () => {
    assert.isFunction(computeGenerationsStats);
  });

  it('debería exponer función sortStudents en objeto global', () => {
    assert.isFunction(sortStudents);
  });

  it('debería exponer función filterStudents en objeto global', () => {
    assert.isFunction(filterStudents);
  });

  describe('computeStudentsStats(laboratoria)', () => {
    const { laboratoria } = fixtures;

    it('debería retornar arreglo de students con propiedad campus y propiedad generation', () => {
      const processed = computeStudentsStats(laboratoria);

      processed.forEach((student) => {
        assert.ok(student.hasOwnProperty('campus'));
        assert.ok(student.hasOwnProperty('generation'));
      });
    });

    it('debería retornar arreglo de students con propiedad stats', () => {
      const processed = computeStudentsStats(laboratoria);

      processed.forEach((student, i) => {
        assert.ok(student.hasOwnProperty('stats'));
        assert.isNumber(student.stats.completedPercentage);
        assert.isObject(student.stats.topics);
        assert.isNumber(student.stats.topics[i].completedPercentage);
        assert.isNumber(student.stats.topics[i].topicDuration);
        assert.isObject(student.stats.topics[i].subtopics);
        assert.isNumber(student['stats']['topics'][i]['subtopics'][i]['completedPercentage']);
        assert.isString(student['stats']['topics'][i]['subtopics'][i]['type']);
        assert.isNumber(student['stats']['topics'][i]['subtopics'][i]['duration']);
      });
    });

    describe('student.stats para el primer usuario en data de prueba - ver carpeta data/', () => {
      const processed = computeStudentsStats(fixtures);

      it('debería tener propiedad completedPercentage con valor 89', () => {
        assert.equal(processed[0].stats.completedPercentage, 89);
      });

      it('debería tener propiedad completedPercentage dentro de propiedad topics con valor 80', () => {
        assert.equal(processed[0].stats.topics['01-Introduccion-a-programacion'].completedPercentage, 80);
      });
      it('debería tener propiedad percentageDuration dentro de propiedad topics con valor 79', () => {
        assert.equal(processed[0].stats.topics['01-Introduccion-a-programacion'].percentageDuration, 79);
      });

      it(`debería tener propiedad subtopics que es un objeto con primera key "0-bienvenida-orientacion" con valor 
      {completado: 1, duracionSubtema: 30, tipo: "lectura"}`, () => {
        const topics = Object.keys(processed[0].stats.topics);
        const subTopics = Object.keys(processed[0].stats.topics[topics[0]].subtopics);

        assert.deepEqual(processed[0].stats.topics[topics[0]].subtopics[subTopics[0]], {
          completado: 1,
          duracionSubtema: 30,
          tipo: 'lectura'
        });
      });
    });
  });

  describe('computeGenerationsStats(laboratoria)', () => {
    const { laboratoria } = fixtures;
    const processed = computeGenerationsStats(fixtures);

    it('debería retornar un arreglo de generaciones con propiedad average y count', () => {
      processed.forEach((generation) => {
        assert.ok(generation.hasOwnProperty('average'));
        assert.ok(generation.hasOwnProperty('count'));
      });
    });

    describe('generation para la primera generación en data de prueba - ver carpeta data/', () => {
      const processed = computeGenerationsStats(fixtures);

      it('debería tener una propiedad average con valor 75', () => {
        assert.equal(processed[0].average, 75);
      });

      it('debería tener una propiedad count con valor 15', () => {
        assert.equal(processed[0].count, 15);
      });
    });
  });

  describe('sortStudents(students, orderBy, orderDirection)', () => {
    const { laboratoria } = fixtures;
    const processedASC = sortStudents(computeStudentsStats(fixtures), 'Nombre', 'ASC');
    const processedDESC = sortStudents(computeStudentsStats(fixtures), 'Nombre', 'DSC');
    const processedpercentageASC = sortStudents(computeStudentsStats(fixtures), 'Porcentaje de Completitud', 'ASC');
    const processedpercentageDESC = sortStudents(computeStudentsStats(fixtures), 'Porcentaje de Completitud', 'DSC');

    it('debería retornar arreglo de estudiantes ordenado por nombre ASC', () => {
      assert.equal(processedASC[0].name, 'Aaliyah Lessie');
      assert.equal(processedASC[133].name, 'Yolanda Zula');
    });
    it('debería retornar arreglo de estudiantes ordenado por nombre DSC', () => {
      assert.equal(processedDESC[0].name, 'Yolanda Zula');
      assert.equal(processedDESC[133].name, 'Aaliyah Lessie');
    });
    it('debería retornar arreglo de estudiantes ordenado por porcentaje general ASC', () => {
      assert.equal(processedpercentageASC[0].name, 'Vicki Annice');
      assert.equal(processedpercentageASC[133].name, 'Rachael Cate');
    });
    it('debería retornar arreglo de estudiantes ordenado por porcentaje general DSC', () => {
      assert.equal(processedpercentageDESC[0].name, 'Iseult Ysolt');
      assert.equal(processedpercentageDESC[133].name, 'Vicki Annice');
    });
  });

  describe('filterStudents(users, search)', () => {
    const processed = filterStudents(computeStudentsStats(fixtures), 'Cari Candyce');
    it('debería retornar nuevo arreglo solo el nombre de Cari Candyce', () => {
      assert.equal(processed.length, 2);
    });
  });
});
(function () {
  var state = {
    entradas: [],
    filtroEstilo: 'ALL',
    filtroFamilia: 'ALL'
  };

  var chipsEl = document.getElementById('chips');
  var chipsFamiliaEl = document.getElementById('chips-familia');
  var gridEl = document.getElementById('grid');
  var emptyStateEl = document.getElementById('empty-state');

  fetch('data/biblioteca.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      state.entradas = data.entradas || [];
      renderChipsFamilia();
      renderChips();
      renderGrid();
    })
    .catch(function (err) {
      console.error('No se pudo cargar data/biblioteca.json', err);
      emptyStateEl.textContent = 'No se pudo cargar la base de datos (data/biblioteca.json).';
      emptyStateEl.hidden = false;
    });

  function primerEstilo(entrada) {
    return (entrada.estilos && entrada.estilos[0]) || 'Sin estilo';
  }

  function familiaDe(entrada) {
    return entrada.familia || 'Sin familia';
  }

  function entradasVisiblesPorFamilia() {
    // Para contar estilos, respeta el filtro de familia activo pero no el de estilo.
    return state.entradas.filter(function (e) {
      return state.filtroFamilia === 'ALL' || familiaDe(e) === state.filtroFamilia;
    });
  }

  function contarPor(lista, fn) {
    var counts = {};
    lista.forEach(function (e) {
      var clave = fn(e);
      counts[clave] = (counts[clave] || 0) + 1;
    });
    return counts;
  }

  function renderChipsFamilia() {
    var counts = contarPor(state.entradas, familiaDe);
    var familias = Object.keys(counts).sort();

    chipsFamiliaEl.innerHTML = '';
    chipsFamiliaEl.appendChild(crearChip('ALL', 'Todas las familias', state.entradas.length, 'familia'));
    familias.forEach(function (familia) {
      chipsFamiliaEl.appendChild(crearChip(familia, familia, counts[familia], 'familia'));
    });
  }

  function renderChips() {
    var visibles = entradasVisiblesPorFamilia();
    var counts = contarPor(visibles, primerEstilo);
    var estilos = Object.keys(counts).sort();

    chipsEl.innerHTML = '';
    chipsEl.appendChild(crearChip('ALL', 'Todas', visibles.length, 'estilo'));
    estilos.forEach(function (estilo) {
      chipsEl.appendChild(crearChip(estilo, estilo, counts[estilo], 'estilo'));
    });
  }

  function crearChip(valor, etiqueta, count, tipo) {
    var btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.textContent = etiqueta + ' ' + count;
    var activo = tipo === 'familia' ? state.filtroFamilia === valor : state.filtroEstilo === valor;
    btn.setAttribute('aria-pressed', String(activo));
    btn.addEventListener('click', function () {
      if (tipo === 'familia') {
        state.filtroFamilia = valor;
        state.filtroEstilo = 'ALL'; // cambiar de familia resetea el sub-filtro de estilo
        renderChips();
      } else {
        state.filtroEstilo = valor;
      }
      renderChipsFamilia();
      renderGrid();
    });
    return btn;
  }

  function renderGrid() {
    var lista = state.entradas.filter(function (e) {
      var pasaFamilia = state.filtroFamilia === 'ALL' || familiaDe(e) === state.filtroFamilia;
      var pasaEstilo = state.filtroEstilo === 'ALL' || primerEstilo(e) === state.filtroEstilo;
      return pasaFamilia && pasaEstilo;
    });

    gridEl.innerHTML = '';
    emptyStateEl.hidden = state.entradas.length !== 0;

    lista.forEach(function (entrada, i) {
      gridEl.appendChild(crearCard(entrada, i, lista.length));
    });
  }

  function crearCard(entrada, i, total) {
    var card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', function () { abrirModal(entrada); });

    var imgWrap = document.createElement('div');
    imgWrap.className = 'card__image-wrap';
    var img = document.createElement('img');
    img.src = entrada.imagen;
    img.alt = entrada.titulo || '';
    imgWrap.appendChild(img);

    var body = document.createElement('div');
    body.className = 'card__body';

    var titleRow = document.createElement('div');
    titleRow.className = 'card__title-row';
    var title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = entrada.titulo || 'Sin título';
    var descriptor = document.createElement('span');
    descriptor.className = 'card__descriptor';
    descriptor.textContent = (entrada.sensaciones || []).slice(0, 2).join(' x ');
    titleRow.appendChild(title);
    titleRow.appendChild(descriptor);

    var tagsWrap = document.createElement('div');
    tagsWrap.className = 'card__tags';
    (entrada.tags || []).slice(0, 3).forEach(function (t) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tagsWrap.appendChild(tag);
    });
    if ((entrada.tags || []).length > 3) {
      var more = document.createElement('span');
      more.className = 'tag';
      more.textContent = '+' + (entrada.tags.length - 3);
      tagsWrap.appendChild(more);
    }

    var footer = document.createElement('div');
    footer.className = 'card__footer';
    var estiloSpan = document.createElement('span');
    estiloSpan.textContent = '◆ ' + primerEstilo(entrada) + ' · ' + familiaDe(entrada);
    var indexSpan = document.createElement('span');
    if (entrada.revisar) {
      indexSpan.className = 'card__revisar';
      indexSpan.textContent = 'REVISAR';
    } else {
      indexSpan.textContent = String(i + 1).padStart(2, '0') + ' / ' + total;
    }
    footer.appendChild(estiloSpan);
    footer.appendChild(indexSpan);

    body.appendChild(titleRow);
    body.appendChild(tagsWrap);
    body.appendChild(footer);

    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
  }

  // Modal

  var modalEl = document.getElementById('modal');
  var modalBackdrop = document.getElementById('modal-backdrop');
  var modalClose = document.getElementById('modal-close');
  var modalImage = document.getElementById('modal-image');
  var modalTitle = document.getElementById('modal-title');
  var modalDescriptor = document.getElementById('modal-descriptor');
  var modalTags = document.getElementById('modal-tags');
  var modalNotas = document.getElementById('modal-notas');
  var modalLink = document.getElementById('modal-link');
  var copyBriefBtn = document.getElementById('copy-brief');
  var copyFeedback = document.getElementById('copy-feedback');

  var entradaActual = null;

  function abrirModal(entrada) {
    entradaActual = entrada;
    modalImage.src = entrada.imagen;
    modalImage.alt = entrada.titulo || '';
    modalTitle.textContent = entrada.titulo || 'Sin título';
    modalDescriptor.textContent = 'Familia: ' + familiaDe(entrada) +
      '  ·  Estilo: ' + (entrada.estilos || []).join(', ') +
      '  ·  Sensaciones: ' + (entrada.sensaciones || []).join(', ');

    modalTags.innerHTML = '';
    (entrada.tags || []).forEach(function (t) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      modalTags.appendChild(tag);
    });

    modalNotas.textContent = entrada.notas || '';

    if (entrada.link) {
      modalLink.textContent = entrada.link;
      modalLink.href = entrada.link;
      modalLink.hidden = false;
    } else {
      modalLink.hidden = true;
    }

    copyFeedback.hidden = true;
    modalEl.hidden = false;
  }

  function cerrarModal() {
    modalEl.hidden = true;
    entradaActual = null;
  }

  modalBackdrop.addEventListener('click', cerrarModal);
  modalClose.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarModal();
  });

  copyBriefBtn.addEventListener('click', function () {
    if (!entradaActual) return;
    var brief = 'Familia: ' + familiaDe(entradaActual) + '. ' +
      'Estilo: ' + (entradaActual.estilos || []).join(', ') + '. ' +
      'Sensaciones: ' + (entradaActual.sensaciones || []).join(', ') + '. ' +
      'Elementos destacados: ' + (entradaActual.tags || []).join(', ') + '.' +
      (entradaActual.notas ? ' Notas: ' + entradaActual.notas + '.' : '') +
      (entradaActual.link ? ' Fuente: ' + entradaActual.link : '');

    navigator.clipboard.writeText(brief).then(function () {
      copyFeedback.hidden = false;
      setTimeout(function () { copyFeedback.hidden = true; }, 2000);
    });
  });
})();

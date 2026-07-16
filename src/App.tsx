import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Dices, Layout, Image as ImageIcon, 
  Table as TableIcon, FileText, Bold, Italic, 
  Heading, List, FilePlus, PlusSquare, X,
  GripHorizontal, MinusSquare, Scaling,
  Save, FolderOpen, Check, Lock, KeyRound,
  Search, ImagePlus, RefreshCw, Download, Upload,
  Unlock, Settings, Smartphone, Palette, MonitorPlay, MousePointer2,
  Swords, Music, ChevronLeft, ChevronRight, Video
} from 'lucide-react';

const THEMES = {
  amber: { main: '#d97706', bg: '#1c1917', text: '#fef3c7' },
  emerald: { main: '#059669', bg: '#064e3b', text: '#d1fae5' },
  blue: { main: '#2563eb', bg: '#1e3a8a', text: '#dbeafe' },
  purple: { main: '#7c3aed', bg: '#4c1d95', text: '#ede9fe' },
  rose: { main: '#e11d48', bg: '#881337', text: '#ffe4e6' }
};

const WidgetCard = ({ widget, updateWidget, removeWidget, bringToFront, isMobileMode, children }) => {
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    bringToFront(widget.id);
    
    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const startPosX = widget.x || 0;
    const startPosY = widget.y || 0;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      // Colisões com as bordas da tela
      let newX = startPosX + dx;
      let newY = startPosY + dy;
      
      const maxX = window.innerWidth - (widget.width || 300);
      const maxY = window.innerHeight - 80; // Margem para a barra de tarefas
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      updateWidget(widget.id, { x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const handleResizeStart = (e) => {
    if (widget.isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront(widget.id);

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const startW = widget.width || 300;
    const startH = widget.height || 300;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dw = clientX - startX;
      const dh = clientY - startY;
      
      const maxWidth = window.innerWidth - (widget.x || 0);
      const maxHeight = window.innerHeight - (widget.y || 0) - 50;

      updateWidget(widget.id, { 
        width: Math.max(250, Math.min(startW + dw, maxWidth)),
        height: Math.max(200, Math.min(startH + dh, maxHeight))
      });
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  return (
    <div 
      ref={cardRef}
      onPointerDown={() => bringToFront(widget.id)}
      className="absolute flex flex-col bg-stone-800 border border-stone-700 rounded-lg shadow-2xl overflow-hidden select-none"
      style={{ 
        left: widget.x, top: widget.y, 
        width: widget.width, height: widget.height, 
        zIndex: widget.zIndex || 1 
      }}
    >
      <div 
        className={`flex justify-between items-center bg-stone-950 px-3 py-2 border-b border-stone-700 ${widget.isLocked ? 'cursor-default' : 'cursor-move'} ${isMobileMode ? 'py-3' : 'py-2'}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2 w-full overflow-hidden">
          {!widget.isLocked && <GripHorizontal size={isMobileMode ? 18 : 14} className="text-stone-500 flex-shrink-0" />}
          <input 
            type="text" 
            value={widget.title}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
            className={`font-bold theme-text bg-transparent outline-none w-full px-1 truncate ${isMobileMode ? 'text-base' : 'text-sm'}`}
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button onPointerDown={e => e.stopPropagation()} onClick={() => updateWidget(widget.id, { isLocked: !widget.isLocked })} className={`text-stone-500 hover:text-white p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`}>
            {widget.isLocked ? <Lock size={isMobileMode ? 18 : 14}/> : <Unlock size={isMobileMode ? 18 : 14}/>}
          </button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => removeWidget(widget.id)} className={`text-red-500 hover:text-red-400 p-1 transition-colors ${isMobileMode ? 'p-2' : ''}`}>
            <X size={isMobileMode ? 18 : 14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-2 relative bg-stone-900">
        {children}
      </div>

      {!widget.isLocked && (
        <div 
          className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-stone-500 hover:theme-text transition-colors z-50 bg-stone-900/50 rounded-tl"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <Scaling size={isMobileMode ? 24 : 16} />
        </div>
      )}
    </div>
  );
};

const PlaylistWidget = ({ widget, updateWidget }) => {
  const [urlInput, setUrlInput] = useState('');
  const tracks = widget.tracks || [];
  const activeTrack = tracks.find(t => t.id === widget.activeTrackId);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  };

  const addTrack = () => {
    if (!urlInput.trim()) return;
    const ytId = getYouTubeId(urlInput);
    const newTrack = { 
      id: Date.now(), 
      name: ytId ? 'Faixa YouTube' : 'Link Web', 
      url: urlInput, 
      ytId: ytId 
    };
    updateWidget(widget.id, { tracks: [...tracks, newTrack] });
    setUrlInput('');
  };

  const exportPlaylist = () => {
    if (tracks.length === 0) return alert("A playlist está vazia!");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tracks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `playlist_dmscreen.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importPlaylist = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const newTracks = imported.map(t => ({ ...t, id: Date.now() + Math.random() }));
          updateWidget(widget.id, { tracks: [...tracks, ...newTracks] });
        }
      } catch (err) {
        alert('Arquivo inválido. Certifique-se de importar um arquivo .json de playlist válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full w-full gap-2">
      {/* Player do YouTube ou Fallback */}
      <div className="w-full h-40 bg-black rounded overflow-hidden flex-shrink-0 border border-stone-700 relative">
        {activeTrack ? (
          activeTrack.ytId ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeTrack.ytId}?autoplay=1&origin=${window.location.origin}`} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="border-0">
            </iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-500">
              <MonitorPlay size={32} className="mb-2"/>
              <a href={activeTrack.url} target="_blank" rel="noreferrer" className="text-xs hover:theme-text underline break-all px-4 text-center">Abrir Link Externo</a>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-600">
            <Music size={32} className="mb-2"/>
            <span className="text-xs font-bold">Nenhuma música tocando</span>
          </div>
        )}
      </div>

      {/* Controles de Importar/Exportar e Input */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <input 
            type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} 
            placeholder="Cole link do YouTube..." 
            className="flex-1 bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs outline-none"
            onKeyDown={e => e.key === 'Enter' && addTrack()}
          />
          <button onClick={addTrack} className="bg-stone-700 hover:bg-stone-600 px-3 rounded text-xs font-bold flex items-center justify-center"><Plus size={14}/></button>
        </div>
        
        <div className="flex justify-between items-center px-1 mt-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Faixas ({tracks.length})</span>
          <div className="flex gap-2">
            <label className="text-[10px] text-stone-400 hover:theme-text cursor-pointer flex items-center gap-1 transition-colors">
              <Upload size={10}/> Importar
              <input type="file" accept=".json" onChange={importPlaylist} className="hidden" />
            </label>
            <button onClick={exportPlaylist} className="text-[10px] text-stone-400 hover:theme-text flex items-center gap-1 transition-colors">
              <Download size={10}/> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Faixas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-stone-950 rounded border border-stone-700 p-1">
        {tracks.map(t => (
          <div 
            key={t.id} 
            onClick={() => updateWidget(widget.id, { activeTrackId: t.id })}
            className={`flex items-center justify-between p-2 rounded mb-1 cursor-pointer border text-xs font-bold ${widget.activeTrackId === t.id ? 'border-[var(--theme-main)] bg-stone-800 text-[var(--theme-main)]' : 'border-stone-800 bg-stone-900 hover:bg-stone-800'}`}
          >
            <input 
              type="text" value={t.name} onClick={e => e.stopPropagation()} 
              onChange={e => updateWidget(widget.id, { tracks: tracks.map(tr => tr.id === t.id ? {...tr, name: e.target.value} : tr) })}
              className="bg-transparent outline-none flex-1 truncate mr-2"
            />
            <button onClick={(e) => { e.stopPropagation(); updateWidget(widget.id, { tracks: tracks.filter(tr => tr.id !== t.id) }); }} className="text-stone-500 hover:text-red-500 flex-shrink-0"><Trash2 size={12}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const InitiativeWidget = ({ widget, updateWidget, isMobileMode }) => {
  const addCombatant = () => {
    const newCombatant = { id: Date.now(), name: 'Personagem', init: '', hp: '' };
    updateWidget(widget.id, { combatants: [...(widget.combatants || []), newCombatant] });
  };

  const updateCombatant = (id, field, value) => {
    const newCombatants = (widget.combatants || []).map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    updateWidget(widget.id, { combatants: newCombatants });
  };

  const removeCombatant = (id) => {
    updateWidget(widget.id, { combatants: (widget.combatants || []).filter(c => c.id !== id) });
  };

  const sortInitiative = () => {
    const sorted = [...(widget.combatants || [])].sort((a, b) => (Number(b.init) || 0) - (Number(a.init) || 0));
    updateWidget(widget.id, { combatants: sorted });
  };

  const combatants = widget.combatants || [];

  return (
    <div className="flex flex-col h-full w-full">
      <div className={`flex gap-2 mb-2 ${isMobileMode ? 'p-1' : ''}`}>
        <button onClick={addCombatant} className={`bg-stone-700 hover:bg-stone-600 rounded font-bold flex items-center gap-1 ${isMobileMode ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}`}>
          <PlusSquare size={14}/> Add
        </button>
        <button onClick={sortInitiative} className={`bg-stone-700 hover:bg-stone-600 rounded font-bold flex items-center gap-1 ${isMobileMode ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'}`}>
          <RefreshCw size={14}/> Sort
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-stone-900 border border-stone-700 rounded p-1">
        {combatants.map((c, i) => (
          <div key={c.id} className={`flex items-center gap-1 p-1 mb-1 rounded border transition-colors ${widget.activeTurn === i ? 'border-[var(--theme-main)] bg-stone-800' : 'border-stone-700 bg-stone-800/50'}`}>
            {widget.activeTurn === i && <ChevronRight size={14} className="theme-text flex-shrink-0" />}
            <input type="text" value={c.name} onChange={(e) => updateCombatant(c.id, 'name', e.target.value)} className={`flex-1 w-20 bg-transparent outline-none font-bold placeholder-stone-600 ${isMobileMode ? 'text-base' : 'text-sm'}`} placeholder="Nome" />
            
            <div className="flex flex-col items-center w-12" title="Iniciativa">
              <span className="text-[9px] text-stone-500 font-bold uppercase mb-[1px]">Init</span>
              <input type="number" value={c.init} onChange={(e) => updateCombatant(c.id, 'init', e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded px-1 text-sm outline-none text-center" placeholder="0" />
            </div>
            
            <div className="flex flex-col items-center w-12" title="Pontos de Vida">
              <span className="text-[9px] text-red-500 font-bold uppercase mb-[1px]">HP</span>
              <input type="text" value={c.hp} onChange={(e) => updateCombatant(c.id, 'hp', e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded px-1 text-sm outline-none text-center" placeholder="-" />
            </div>

            <button onClick={() => removeCombatant(c.id)} className="text-stone-500 hover:text-red-400 p-1 flex-shrink-0">
              <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>
      {combatants.length > 0 && (
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-700 bg-stone-950 p-1 rounded">
          <button onClick={() => updateWidget(widget.id, { activeTurn: Math.max(0, (widget.activeTurn || 0) - 1) })} className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded"><ChevronLeft size={20}/></button>
          <span className="text-sm font-bold theme-text truncate px-2">Turno: {combatants[widget.activeTurn || 0]?.name || '-'}</span>
          <button onClick={() => updateWidget(widget.id, { activeTurn: ((widget.activeTurn || 0) + 1) % combatants.length })} className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded"><ChevronRight size={20}/></button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [topZ, setTopZ] = useState(10);
  const [widgets, setWidgets] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // App Settings State
  const [appSettings, setAppSettings] = useState({ 
    theme: 'amber', 
    bgType: 'none', 
    bgValue: '#1c1917', 
    opacity: 30, 
    enableMusic: true 
  });
  
  const [isMobileMode, setIsMobileMode] = useState(false);
  
  // Template Modal States
  const [templateName, setTemplateName] = useState('');
  const [templatePassword, setTemplatePassword] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  
  // Universal Pass
  const UNIVERSAL_PASS = "71996813993";

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('dmscreen_layout');
    if (saved) setWidgets(JSON.parse(saved));
    const savedTemplates = localStorage.getItem('dmscreen_templates');
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    const savedSettings = localStorage.getItem('dmscreen_settings');
    if (savedSettings) setAppSettings(JSON.parse(savedSettings));

    const checkMobile = () => setIsMobileMode(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helpers
  const updateWidget = (id, updates) => setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  const bringToFront = (id) => { const newZ = topZ + 1; setTopZ(newZ); updateWidget(id, { zIndex: newZ }); };
  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));

  // Widget Factory
  const addWidget = (type) => {
    const offset = (widgets.length % 5) * 40;
    const newWidget = { 
      id: Date.now(), type, title: type.charAt(0).toUpperCase() + type.slice(1),
      x: 50 + offset, y: 50 + offset, zIndex: topZ + 1,
      width: 350, height: 300, isLocked: false
    };
    
    if (type === 'note') {
      newWidget.title = 'Anotações';
      newWidget.pages = [{ id: Date.now() + 1, title: 'Nova Página', content: '' }];
      newWidget.activePageId = newWidget.pages[0].id;
    } else if (type === 'dice') {
      newWidget.title = 'Rolador de Dados';
      newWidget.result = '---';
      newWidget.history = [];
      newWidget.qty = 1;
      newWidget.mod = 0;
    } else if (type === 'initiative') {
      newWidget.title = 'Iniciativa';
      newWidget.combatants = [];
      newWidget.activeTurn = 0;
    } else if (type === 'playlist') {
      newWidget.title = 'Música / Sons';
      newWidget.tracks = [];
    } else if (type === 'image') {
      newWidget.title = 'Imagem';
    } else if (type === 'table') {
      newWidget.title = 'Tabela';
      newWidget.rows = [['', ''], ['', '']];
    }
    
    setWidgets([...widgets, newWidget]);
    setTopZ(topZ + 1);
  };

  const saveTemplate = (existingId = null) => {
    if (!existingId && !templateName.trim()) {
      setModalMessage({ type: 'error', text: 'Digite um nome para o modelo.' });
      return;
    }
    
    try {
      let updatedTemplates = [...templates];
      
      if (existingId) {
        const existing = updatedTemplates.find(t => t.id === existingId);
        if (existing.password && existing.password !== UNIVERSAL_PASS) {
          const pass = prompt("Este modelo está protegido. Digite a senha para sobrescrever:");
          if (pass !== existing.password && pass !== UNIVERSAL_PASS) {
            alert("Senha Incorreta!");
            return;
          }
        }
        existing.widgets = widgets;
        existing.topZ = topZ;
        existing.date = new Date().toLocaleDateString();
      } else {
        const newTemplate = {
          id: Date.now(),
          name: templateName,
          password: templatePassword,
          image: templateImage,
          widgets: widgets,
          topZ: topZ,
          date: new Date().toLocaleDateString()
        };
        updatedTemplates.push(newTemplate);
      }
      
      localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      setModalMessage({ type: 'success', text: 'Modelo salvo com sucesso!' });
      setTimeout(() => setModalMessage({ type: '', text: '' }), 3000);
      setTemplateName(''); setTemplatePassword(''); setTemplateImage(null);
    } catch (error) {
      setModalMessage({ type: 'error', text: 'Erro ao salvar. Verifique se imagens não ultrapassam o limite do navegador.' });
    }
  };

  const loadTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      if (template.password && template.password !== UNIVERSAL_PASS) {
        const pass = prompt("Este modelo requer senha:");
        if (pass !== template.password && pass !== UNIVERSAL_PASS) {
          alert("Senha incorreta!");
          return;
        }
      }
      setWidgets(template.widgets);
      setTopZ(template.topZ);
      setShowTemplateModal(false);
    }
  };

  const deleteTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    if (template.password && template.password !== UNIVERSAL_PASS) {
      const pass = prompt("Este modelo requer senha para ser deletado:");
      if (pass !== template.password && pass !== UNIVERSAL_PASS) {
        alert("Senha incorreta!");
        return;
      }
    }
    const updatedTemplates = templates.filter(t => t.id !== id);
    localStorage.setItem('dmscreen_templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const exportAllTemplates = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `dmscreen_backup.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importTemplates = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const merged = [...templates, ...imported];
          localStorage.setItem('dmscreen_templates', JSON.stringify(merged));
          setTemplates(merged);
          alert('Modelos importados com sucesso!');
        }
      } catch (err) {
        alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const renderNoteWidget = (widget) => {
    const activePage = widget.pages.find(p => p.id === widget.activePageId) || widget.pages[0];
    const addPage = () => {
      const newPage = { id: Date.now(), title: `Pág ${widget.pages.length + 1}`, content: '' };
      updateWidget(widget.id, { pages: [...widget.pages, newPage], activePageId: newPage.id });
    };
    const updatePageTitle = (pageId, newTitle) => {
      updateWidget(widget.id, { pages: widget.pages.map(p => p.id === pageId ? { ...p, title: newTitle } : p) });
    };

    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex overflow-x-auto bg-stone-900 rounded-t-lg border-b border-stone-700 p-1 gap-1 custom-scrollbar">
          {widget.pages.map(page => (
            <div 
              key={page.id} onClick={() => updateWidget(widget.id, { activePageId: page.id })}
              className={`flex items-center gap-1 px-2 py-1 text-sm rounded cursor-pointer group whitespace-nowrap ${widget.activePageId === page.id ? 'bg-stone-700 theme-text' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}
            >
              <input type="text" value={page.title} onChange={e => updatePageTitle(page.id, e.target.value)} className="bg-transparent outline-none w-20 text-center font-bold" onClick={e => e.stopPropagation()} />
              {widget.pages.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newPages = widget.pages.filter(p => p.id !== page.id);
                    updateWidget(widget.id, { pages: newPages, activePageId: widget.activePageId === page.id ? newPages[0].id : widget.activePageId });
                  }} 
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addPage} className="px-2 py-1 text-stone-400 hover:theme-text flex-shrink-0"><FilePlus size={16} /></button>
        </div>
        <div className="flex gap-2 p-1 bg-stone-800 border-b border-stone-700 flex-wrap">
          <button onClick={() => document.execCommand('bold', false, null)} className="p-1 hover:bg-stone-700 rounded text-stone-300"><Bold size={14} /></button>
          <button onClick={() => document.execCommand('italic', false, null)} className="p-1 hover:bg-stone-700 rounded text-stone-300"><Italic size={14} /></button>
          <button onClick={() => document.execCommand('formatBlock', false, 'H2')} className="p-1 hover:bg-stone-700 rounded text-stone-300"><Heading size={14} /></button>
        </div>
        <div 
          className="flex-1 w-full bg-stone-900 p-3 rounded-b-lg text-sm text-stone-200 outline-none overflow-y-auto"
          contentEditable suppressContentEditableWarning
          onBlur={(e) => updateWidget(widget.id, { pages: widget.pages.map(p => p.id === activePage.id ? { ...p, content: e.currentTarget.innerHTML } : p) })}
          dangerouslySetInnerHTML={{ __html: activePage.content }}
        />
      </div>
    );
  };

  const renderDiceWidget = (widget) => {
    const roll = (sides) => {
      const q = parseInt(widget.qty) || 1;
      const m = parseInt(widget.mod) || 0;
      let sum = 0; let results = [];
      for(let i=0; i<q; i++) { const val = Math.floor(Math.random() * sides) + 1; sum += val; results.push(val); }
      const total = sum + m;
      const histStr = `${q}d${sides}${m !== 0 ? (m > 0 ? '+'+m : m) : ''} ➔ ${total} [${results.join(',')}]`;
      updateWidget(widget.id, { result: total, history: [histStr, ...(widget.history || [])].slice(0, 5) });
    };

    return (
      <div className="flex flex-col items-center h-full gap-2 relative">
        <div className="text-5xl font-black theme-text bg-stone-950 w-full text-center py-4 rounded border border-stone-700 flex-1 flex items-center justify-center shadow-inner">
          {widget.result}
        </div>
        
        <div className="flex gap-2 w-full justify-center bg-stone-800 p-2 rounded border border-stone-700">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">QTD</span>
            <input type="number" value={widget.qty || 1} onChange={e => updateWidget(widget.id, { qty: e.target.value })} className="w-12 bg-stone-950 text-center rounded border border-stone-600 text-sm py-1 outline-none theme-text font-bold" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-stone-400">MOD</span>
            <input type="number" value={widget.mod || 0} onChange={e => updateWidget(widget.id, { mod: e.target.value })} className="w-12 bg-stone-950 text-center rounded border border-stone-600 text-sm py-1 outline-none theme-text font-bold" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1 w-full">
          {[4, 6, 8, 10, 12, 20, 100].map(d => (
            <button key={d} onClick={() => roll(d)} className="bg-stone-700 hover:bg-stone-600 transition-colors px-2 py-2 rounded font-bold border border-stone-600 flex-1 min-w-[35px] text-center text-xs shadow">D{d}</button>
          ))}
        </div>

        <div className="w-full text-[10px] text-stone-500 bg-stone-950 p-1 rounded overflow-hidden max-h-16 overflow-y-auto custom-scrollbar">
          {(widget.history || []).map((h, i) => <div key={i} className="truncate">{h}</div>)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-stone-100 font-sans" style={{ '--theme-main': THEMES[appSettings.theme].main, backgroundColor: THEMES[appSettings.theme].bg }}>
      
      {/* Background Handler */}
      {appSettings.bgType === 'image' && <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${appSettings.bgValue})`, opacity: appSettings.opacity / 100 }} />}
      {appSettings.bgType === 'video' && (
        <video autoPlay loop muted className="absolute inset-0 z-0 w-full h-full object-cover" style={{ opacity: appSettings.opacity / 100 }}>
          <source src={appSettings.bgValue} type="video/mp4" />
        </video>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-stone-950/90 p-3 border-b border-stone-700 z-50 flex-shrink-0 shadow-md gap-3 backdrop-blur-sm">
        <h1 className="text-xl font-bold theme-text flex items-center gap-2 select-none"><Layout size={20} /> DM SCREEN</h1>
        
        <div className="flex flex-wrap justify-center gap-1.5 flex-1">
          <button onClick={() => addWidget('note')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><FileText size={14} /> Nota</button>
          <button onClick={() => addWidget('dice')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Dices size={14} /> Dados</button>
          <button onClick={() => addWidget('initiative')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Swords size={14} /> Init</button>
          {appSettings.enableMusic && (
            <button onClick={() => addWidget('playlist')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><Music size={14} /> Som</button>
          )}
          <button onClick={() => addWidget('image')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><ImageIcon size={14} /></button>
          <button onClick={() => addWidget('table')} className="bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded flex items-center gap-1.5 border border-stone-700 text-xs font-bold transition-colors"><TableIcon size={14} /></button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setIsMobileMode(!isMobileMode)} className={`p-2 rounded border transition-colors ${isMobileMode ? 'bg-[var(--theme-main)] border-[var(--theme-main)] text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-400'}`} title="Modo Mobile">
            <Smartphone size={16} />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-400 transition-colors" title="Configurações">
            <Settings size={16} />
          </button>
          <button onClick={() => setShowTemplateModal(true)} className="bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors px-3 py-1.5 rounded flex items-center gap-2 border border-stone-600 text-xs font-bold">
            <FolderOpen size={14} className="theme-text" /> Salvar Layout
          </button>
        </div>
      </header>

      {/* Main Desktop Area */}
      <main className="relative flex-1 w-full overflow-hidden z-10" id="desktop-area">
        {widgets.map((widget) => (
          <WidgetCard key={widget.id} widget={widget} updateWidget={updateWidget} removeWidget={removeWidget} bringToFront={bringToFront} isMobileMode={isMobileMode}>
            {widget.type === 'note' && renderNoteWidget(widget)}
            {widget.type === 'dice' && renderDiceWidget(widget)}
            {widget.type === 'initiative' && <InitiativeWidget widget={widget} updateWidget={updateWidget} isMobileMode={isMobileMode} />}
            {widget.type === 'playlist' && <PlaylistWidget widget={widget} updateWidget={updateWidget} />}
            {widget.type === 'image' && (
              <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-stone-700 rounded p-1 relative">
                {widget.imageData ? (
                  <img src={widget.imageData} alt="Mapa/Arte" className="w-full h-full object-contain" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center text-stone-500 hover:theme-text w-full h-full justify-center">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs text-center">Clique para carregar imagem</span>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateWidget(widget.id, { imageData: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} className="hidden" />
                  </label>
                )}
              </div>
            )}
            {widget.type === 'table' && (
              <div className="w-full h-full text-stone-400 flex flex-col items-center justify-center text-xs">
                 (Tabela Simplificada - Pode ser aprimorada na próxima versão)
              </div>
            )}
          </WidgetCard>
        ))}
      </main>

      {/* Taskbar */}
      <footer className="flex items-center gap-2 bg-stone-950 border-t border-stone-700 px-2 py-1 overflow-x-auto z-50 flex-shrink-0">
        <div className="text-[10px] font-bold text-stone-500 uppercase px-2">Janelas: {widgets.length}</div>
        {widgets.map(w => (
          <button key={`task-${w.id}`} onClick={() => bringToFront(w.id)} className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded text-xs font-bold border border-stone-700 truncate max-w-[120px] transition-colors theme-text">
            {w.title}
          </button>
        ))}
      </footer>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-md p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-stone-700 pb-2">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2"><Settings size={20}/> Configurações da Mesa</h2>
              <button onClick={() => { setShowSettingsModal(false); localStorage.setItem('dmscreen_settings', JSON.stringify(appSettings)); }} className="text-red-400"><X size={20}/></button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Tema de Cores</label>
              <div className="flex gap-2">
                {Object.keys(THEMES).map(t => (
                  <button key={t} onClick={() => setAppSettings({...appSettings, theme: t})} className={`w-8 h-8 rounded-full border-2 ${appSettings.theme === t ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t].main }} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-stone-400 uppercase flex items-center justify-between">
                Fundo de Tela
                <div className="flex items-center gap-2 text-stone-200">
                  <span className="text-[10px]">Opacidade</span>
                  <input type="range" min="10" max="100" value={appSettings.opacity} onChange={e => setAppSettings({...appSettings, opacity: e.target.value})} className="w-20"/>
                </div>
              </label>
              <select value={appSettings.bgType} onChange={e => setAppSettings({...appSettings, bgType: e.target.value})} className="bg-stone-950 border border-stone-700 rounded p-2 text-sm text-stone-200 outline-none">
                <option value="none">Cor Sólida do Tema</option>
                <option value="image">Imagem (URL)</option>
                <option value="video">Vídeo / GIF Animado (URL mp4)</option>
              </select>
              {appSettings.bgType !== 'none' && (
                <input type="text" value={appSettings.bgType !== 'none' ? appSettings.bgValue : ''} onChange={e => setAppSettings({...appSettings, bgValue: e.target.value})} placeholder="Cole o URL da imagem ou vídeo..." className="bg-stone-950 border border-stone-700 rounded p-2 text-sm outline-none w-full mt-1" />
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={appSettings.enableMusic} onChange={e => setAppSettings({...appSettings, enableMusic: e.target.checked})} className="accent-[var(--theme-main)]" />
                <span className="text-sm font-bold text-stone-300">Habilitar Módulo de Música/Som no menu superior</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-stone-700 bg-stone-950">
              <h2 className="text-lg font-bold theme-text flex items-center gap-2"><Save size={20} /> Modelos de Escudo</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-stone-400 hover:text-red-400"><X size={20} /></button>
            </div>
            
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-2 bg-stone-950 p-3 rounded border border-stone-700">
                <label className="text-xs font-bold text-stone-400 uppercase">Salvar Novo Modelo</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-stone-800 p-2 rounded hover:bg-stone-700 transition" title="Imagem de Capa">
                    {templateImage ? <img src={templateImage} className="w-8 h-8 rounded object-cover" alt="capa" /> : <ImagePlus size={24} className="text-stone-500"/>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onloadend = () => setTemplateImage(r.result); r.readAsDataURL(f); }
                    }}/>
                  </label>
                  <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nome do Layout" className="flex-1 bg-stone-800 border border-stone-600 rounded px-2 py-2 text-sm outline-none" />
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-2 top-3 text-stone-500" />
                    <input type="password" value={templatePassword} onChange={(e) => setTemplatePassword(e.target.value)} placeholder="Senha (Opcional)" className="w-32 bg-stone-800 border border-stone-600 rounded pl-7 pr-2 py-2 text-sm outline-none" />
                  </div>
                  <button onClick={() => saveTemplate(null)} className="bg-[var(--theme-main)] text-stone-900 font-bold px-3 py-2 rounded text-sm hover:opacity-80">Salvar</button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="relative w-1/2">
                  <Search size={14} className="absolute left-2 top-2 text-stone-500" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar..." className="w-full bg-stone-950 border border-stone-700 rounded pl-7 pr-2 py-1 text-xs outline-none" />
                </div>
                <div className="flex gap-2">
                   <label className="cursor-pointer text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1">
                     <Upload size={12}/> Importar Backup
                     <input type="file" accept=".json" onChange={importTemplates} className="hidden" />
                   </label>
                   <button onClick={exportAllTemplates} className="text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-stone-300 font-bold flex items-center gap-1">
                     <Download size={12}/> Exportar Backup
                   </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-stone-800 border border-stone-700 p-2 rounded group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {t.image ? <img src={t.image} className="w-10 h-10 rounded object-cover flex-shrink-0" alt="" /> : <div className="w-10 h-10 rounded bg-stone-900 flex items-center justify-center flex-shrink-0"><Layout size={16} className="text-stone-600"/></div>}
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-200 flex items-center gap-1">
                          {t.name} {t.password && <Lock size={12} className="text-amber-500"/>}
                        </span>
                        <span className="text-[10px] text-stone-500">{t.date} • {t.widgets.length} janelas</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => saveTemplate(t.id)} className="p-2 text-stone-400 hover:text-blue-400 hover:bg-stone-700 rounded transition-colors" title="Sobrescrever (Atualizar)">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => loadTemplate(t.id)} className="px-3 py-1.5 bg-stone-700 hover:bg-[var(--theme-main)] hover:text-stone-900 text-stone-200 rounded text-xs font-bold transition-colors">
                        Carregar
                      </button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-700 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .theme-text { color: var(--theme-main); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1c1917; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--theme-main); }
      `}} />
    </div>
  );
};

export default App;

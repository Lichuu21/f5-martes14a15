

        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#00c853',
                        primaryDark: '#009624',
                        surface: '#ffffff',
                        background: '#f8fafc',
                        ink: '#0f172a',
                        textMuted: '#64748b',
                        borderLight: '#e2e8f0',
                        sidebarBg: 'rgba(255, 255, 255, 0.95)',
                        sidebarBorder: '#e2e8f0',
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    

        // --- DIVISOR DE GASTOS EXPRESS ---
        (function initSplitter() {
            // Inicializar con 2 personas por defecto
            updatePersonsLabel();
        })();

        function updatePersonsLabel() {
            const n = parseInt(document.getElementById('split-persons').innerText) || 1;
            const label = document.getElementById('split-persons-label');
            if (label) label.innerText = n === 1 ? '1 persona' : `${n} personas`;
        }

        window.changeSplitPersons = function (delta) {
            const el = document.getElementById('split-persons');
            let val = parseInt(el.innerText) + delta;
            if (val < 1) val = 1;
            if (val > 50) val = 50;

            // Animación bounce del número
            el.style.transform = delta > 0 ? 'scale(1.4) translateY(-4px)' : 'scale(1.4) translateY(4px)';
            el.style.color = delta > 0 ? '#00c853' : '#f87171';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.color = '';
            }, 180);

            el.innerText = val;
            updatePersonsLabel();
            calculateSplit();
        };

        window.calculateSplit = function () {
            const total = parseFloat(document.getElementById('split-total').value) || 0;
            const persons = parseInt(document.getElementById('split-persons').innerText) || 1;
            const resultEl = document.getElementById('split-result');
            const wrapEl = document.getElementById('split-result-wrap');
            const checkEl = document.getElementById('split-check');
            const barEl = document.getElementById('split-bar');
            const barLabel = document.getElementById('split-bar-label');

            const split = total / persons;

            // Animación del resultado: sale y vuelve
            wrapEl.style.opacity = '0';
            wrapEl.style.transform = 'scale(0.85) translateY(6px)';
            setTimeout(() => {
                resultEl.innerText = '$' + split.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                wrapEl.style.opacity = '1';
                wrapEl.style.transform = 'scale(1) translateY(0)';
            }, 140);

            // Check icon
            checkEl.style.opacity = total > 0 ? '1' : '0';

            // Barra proporcional: porcentaje del total que paga cada uno vs el total
            // Representa visualmente cuánto es la porción de cada uno vs el total
            const pct = persons > 0 ? Math.min(100, (1 / persons) * 100) : 0;
            barEl.style.width = total > 0 ? pct + '%' : '0%';
            barLabel.innerText = total > 0
                ? `${persons > 1 ? `Cada uno paga el ${Math.round(pct)}% del total` : 'Pagás vos solo/a'}`
                : 'Ingresá un monto';
        };

        // --- LÓGICA DE NAVEGACIÓN SPA Y UI (Prioridad Alta) ---
        const views = ['home', 'soccer', 'hangouts', 'birthdays', 'profile', 'jersey'];

        function switchView(viewId) {
            views.forEach(v => {
                const btn = document.getElementById(`btn-tab-${v}`);
                const view = document.getElementById(`view-${v}`);
                if (btn) btn.classList.remove('active');
                if (view) view.classList.add('hidden');
            });

            const activeBtn = document.getElementById(`btn-tab-${viewId}`);
            if (activeBtn) activeBtn.classList.add('active');

            const viewEl = document.getElementById(`view-${viewId}`);
            if (viewEl) viewEl.classList.remove('hidden');

            if (window.innerWidth < 768) {
                const sidebar = document.getElementById('main-sidebar');
                if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                    toggleSidebar();
                }
            }
            if (typeof setupScrollReveal === 'function') setupScrollReveal();

            /* Renderizar avatares si se cambia a perfil */
            if (viewId === 'profile') {
                if (typeof renderAvatarGrid === 'function') {
                    renderAvatarGrid();
                }
                if (typeof loadProfileName === 'function') {
                    loadProfileName();
                }
            }
            /* Actualizar datos de la camiseta al entrar a El Manto Sagrado */
            if (viewId === 'jersey') {
                updateMantoData();
            }
        }

        /* ---- HEADER BLUR AL HACER SCROLL ---- */
        (function setupHeaderScroll() {
            const mainEl = document.querySelector('main');
            if (!mainEl) return;
            mainEl.addEventListener('scroll', () => {
                const header = mainEl.querySelector('header');
                if (!header) return;
                if (mainEl.scrollTop > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        })();

        /* ---- STAGGER DELAY EN CARDS AL ENTRAR ---- */
        function applyStaggerDelay() {
            document.querySelectorAll('.reveal-on-scroll').forEach((el, i) => {
                el.style.transitionDelay = `${i * 60}ms`;
            });
        }
        document.addEventListener('DOMContentLoaded', applyStaggerDelay);

        /* ---- ACTUALIZAR STATS DEL SIDEBAR (contador animado) ---- */
        function updateSidebarStats(matchesCount, hangoutsCount) {
            const mEl = document.getElementById('sidebar-stat-matches');
            const hEl = document.getElementById('sidebar-stat-hangouts');
            if (mEl) {
                mEl.textContent = matchesCount;
                mEl.classList.remove('count-up');
                void mEl.offsetWidth; // force reflow
                mEl.classList.add('count-up');
            }
            if (hEl) {
                hEl.textContent = hangoutsCount;
                hEl.classList.remove('count-up');
                void hEl.offsetWidth;
                hEl.classList.add('count-up');
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('main-sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (!sidebar || !overlay) return;
            const isClosed = sidebar.classList.contains('-translate-x-full');

            if (isClosed) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.replace('opacity-0', 'opacity-100'), 10);
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        // --- SUPABASE, ESTADO GLOBAL Y AUTH ---
        let supabase = null;
        let authMode = 'login'; // 'login' o 'register'
        const supabaseUrl = 'https://nstbdhbnfhhfmlkwfabq.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdGJkaGJuZmhoZm1sa3dmYWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjgyNDAsImV4cCI6MjA5NjA0NDI0MH0.7CXmNo-iOkVzHXtjsaBy1C2gHk2UsmQFezKxm3cwRWY';

        import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
            .then((module) => {
                supabase = module.createClient(supabaseUrl, supabaseKey);

                // Escuchar cambios de sesión
                supabase.auth.onAuthStateChange((event, session) => {
                    const loginView = document.getElementById('login-view');
                    const appContent = document.getElementById('app-content');

                    if (session) {
                        // Usuario logeado
                        AppState.currentUser = session.user.user_metadata?.first_name || session.user.email.split('@')[0];
                        // Cargar número de camiseta desde Supabase metadata o localStorage
                        const jerseyFromMeta = session.user.user_metadata?.jersey_number;
                        const jerseyFromLocal = localStorage.getItem('userJerseyNumber');
                        const jerseyNumber = jerseyFromMeta || jerseyFromLocal;
                        if (jerseyNumber) {
                            AppState.userJerseyNumber = parseInt(jerseyNumber);
                            updateHeaderJersey(AppState.userJerseyNumber);
                        }
                        loginView.classList.add('hidden');
                        appContent.classList.remove('hidden');
                        fetchEvents(); // Cargar datos del usuario
                    } else {
                        // Usuario NO logeado
                        loginView.classList.remove('hidden');
                        appContent.classList.add('hidden');
                    }
                });
            })
            .catch((e) => {
                console.warn('Error al cargar Supabase', e);
            });

        // --- LÓGICA DE LOGIN / REGISTRO ---
        function toggleAuthMode() {
            authMode = authMode === 'login' ? 'register' : 'login';
            const btn = document.getElementById('auth-submit-btn');
            const subtitle = document.getElementById('login-subtitle');
            const toggleText = document.getElementById('auth-toggle-text');
            const toggleBtn = document.getElementById('auth-toggle-btn');
            const registerFields = document.getElementById('register-fields');

            if (authMode === 'login') {
                btn.innerText = 'Iniciar Sesión';
                subtitle.innerText = 'Ingresa para coordinar tus partidos y juntadas con amigos.';
                toggleText.innerText = '¿No tienes cuenta?';
                toggleBtn.innerText = 'Regístrate';
                registerFields.classList.add('hidden');
                registerFields.classList.remove('flex');
                document.getElementById('auth-name').required = false;
                document.getElementById('auth-lastname').required = false;
                document.getElementById('auth-birthdate').required = false;
            } else {
                btn.innerText = 'Crear Cuenta';
                subtitle.innerText = 'Regístrate para formar parte de la comunidad.';
                toggleText.innerText = '¿Ya tienes cuenta?';
                toggleBtn.innerText = 'Inicia Sesión';
                registerFields.classList.remove('hidden');
                registerFields.classList.add('flex');
                document.getElementById('auth-name').required = true;
                document.getElementById('auth-lastname').required = true;
                document.getElementById('auth-birthdate').required = true;
            }
        }

        async function handleAuth(e) {
            e.preventDefault();
            if (!supabase) return alert("Error de conexión");

            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const submitBtn = document.getElementById('auth-submit-btn');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Cargando...';
            submitBtn.disabled = true;

            try {
                if (authMode === 'register') {
                    const name = document.getElementById('auth-name').value;
                    const lastname = document.getElementById('auth-lastname').value;
                    const birthdate = document.getElementById('auth-birthdate').value;

                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { first_name: name, last_name: lastname, birth_date: birthdate }
                        }
                    });
                    if (error) throw error;

                    // Guardar en la tabla de cumpleaños como miembro registrado
                    const fullName = '[MEMBER] ' + name + ' ' + lastname;
                    await supabase.from('birthdays').insert([{ name: fullName, birth_date: birthdate }]);

                    alert('¡Cuenta creada! Ya puedes iniciar sesión.');
                    toggleAuthMode();
                } else {
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    // El onAuthStateChange ocultará el login automáticamente
                }
            } catch (error) {
                alert("Error: " + error.message);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }

        async function handleLogout() {
            if (supabase) await supabase.auth.signOut();
        }

        const AppState = {
            soccer: [],
            hangouts: [],
            birthdays: []
        };

        async function fetchEvents() {
            if (!supabase) return;
            try {
                const [resSoccer, resHangouts, resBirthdays] = await Promise.all([
                    supabase.from('matches').select('*').order('created_at', { ascending: false }),
                    supabase.from('hangouts').select('*').order('created_at', { ascending: false }),
                    supabase.from('birthdays').select('*').order('created_at', { ascending: false })
                ]);

                if (resSoccer.data) {
                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);

                    const todayStr = todayStart.getFullYear() + '-' + String(todayStart.getMonth() + 1).padStart(2, '0') + '-' + String(todayStart.getDate()).padStart(2, '0');
                    AppState.soccer = [];
                    AppState.pastSoccer = [];
                    
                    resSoccer.data.forEach(match => {
                        let isUpcoming = true;
                        if (match.date) {
                            let y, m, d;
                            if (match.date.includes('-')) {
                                [y, m, d] = match.date.split('-');
                            } else if (match.date.includes('/')) {
                                [d, m, y] = match.date.split('/');
                            }
                            if (y && m && d) {
                                const dateStr = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                                isUpcoming = dateStr >= todayStr;
                            }
                        }
                        if (isUpcoming) {
                            AppState.soccer.push(match);
                        } else {
                            AppState.pastSoccer.push(match);
                        }
                    });

                    // Sort upcoming matches by date and time ascending
                    AppState.soccer.sort((a, b) => {
                        const dateA = new Date(a.date + 'T' + (a.time || '00:00:00'));
                        const dateB = new Date(b.date + 'T' + (b.time || '00:00:00'));
                        return dateA - dateB;
                    });

                    // Sort past matches by date descending (newest first)
                    AppState.pastSoccer.sort((a, b) => {
                        const dateA = new Date(a.date + 'T' + (a.time || '00:00:00'));
                        const dateB = new Date(b.date + 'T' + (b.time || '00:00:00'));
                        return dateB - dateA;
                    });

                    // Populate AppState.anotados from the players database column
                    AppState.anotados = {};
                    resSoccer.data.forEach(match => {
                        AppState.anotados[match.id] = match.players || [];
                    });
                }
                if (resHangouts.data) AppState.hangouts = resHangouts.data;
                if (resBirthdays.data) AppState.birthdays = resBirthdays.data;

                console.log("Datos sincronizados con Supabase:", AppState);
                renderEvents(); // Renderizar UI
                // Actualizar estadísticas del sidebar
                if (typeof updateSidebarStats === 'function') {
                    updateSidebarStats(AppState.soccer.length, AppState.hangouts.length);
                }
            } catch (error) {
                console.error("Error sincronizando con Supabase:", error);
            }
        }

        window.deleteMatch = async function (id) {
            if (!confirm("¿Estás seguro de que quieres eliminar este partido?")) return;
            try {
                const { error } = await supabase.from('matches').delete().eq('id', id);
                if (error) throw error;
                addNotification('Partido Eliminado', 'Se ha borrado el partido.', 'delete');
                await fetchEvents();
            } catch (e) {
                alert("Error al borrar: " + e.message);
            }
        };

        window.editMatch = function (id) {
            const match = AppState.soccer.find(m => m.id === id);
            if (!match) return;
            document.getElementById('f5-title').value = match.title;
            document.getElementById('f5-type').value = match.match_type || 'F5';
            document.getElementById('f5-date').value = match.date;
            document.getElementById('f5-time').value = match.time;
            document.getElementById('f5-location').value = match.location;

            document.getElementById('form-soccer').dataset.editingId = id;
            document.getElementById('modal-title').innerText = 'Editar Partido';
            const submitBtn = document.getElementById('btn-submit-soccer');
            if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
            document.getElementById('step-select-type').classList.add('hidden');
            document.getElementById('form-soccer').classList.remove('hidden');

            const overlay = document.getElementById('create-modal-overlay');
            const modal = document.getElementById('create-modal');
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => {
                overlay.classList.replace('opacity-0', 'opacity-100');
                modal.classList.replace('scale-95', 'scale-100');
            }, 10);
        };

        window.deleteHangout = async function (id) {
            if (!confirm("¿Estás seguro de que quieres eliminar esta juntada?")) return;
            try {
                const { error } = await supabase.from('hangouts').delete().eq('id', id);
                if (error) throw error;
                addNotification('Juntada Eliminada', 'Se ha borrado la juntada.', 'delete');
                await fetchEvents();
            } catch (e) {
                alert("Error al borrar: " + e.message);
            }
        };

        window.editHangout = function (id) {
            const hangout = AppState.hangouts.find(h => h.id === id);
            if (!hangout) return;
            document.getElementById('hj-title').value = hangout.title;
            document.getElementById('hj-date').value = hangout.date;
            document.getElementById('hj-time').value = hangout.time;
            document.getElementById('hj-food').value = (hangout.food_options || []).join(', ');

            document.getElementById('form-hangout').dataset.editingId = id;
            document.getElementById('modal-title').innerText = 'Editar Juntada';
            const submitBtn = document.getElementById('btn-submit-hangout');
            if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
            document.getElementById('step-select-type').classList.add('hidden');
            document.getElementById('form-hangout').classList.remove('hidden');

            const overlay = document.getElementById('create-modal-overlay');
            const modal = document.getElementById('create-modal');
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => {
                overlay.classList.replace('opacity-0', 'opacity-100');
                modal.classList.replace('scale-95', 'scale-100');
            }, 10);
        };

        window.editBirthday = function (id) {
            const bday = AppState.birthdays.find(b => b.id === id);
            if (!bday) return;
            document.getElementById('bd-name').value = bday.name;
            document.getElementById('bd-date').value = bday.birth_date;

            document.getElementById('form-birthday').dataset.editingId = id;
            document.getElementById('modal-title').innerText = 'Editar Cumpleaños';
            const submitBtn = document.getElementById('btn-submit-birthday');
            if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
            document.getElementById('step-select-type').classList.add('hidden');
            document.getElementById('form-birthday').classList.remove('hidden');

            const overlay = document.getElementById('create-modal-overlay');
            const modal = document.getElementById('create-modal');
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => {
                overlay.classList.replace('opacity-0', 'opacity-100');
                modal.classList.replace('scale-95', 'scale-100');
            }, 10);
        };

        window.renderTeamSlots = function (matchId, team, matchType, anotados) {
            const getPlayer = (slot) => {
                const found = anotados.find(a => a.startsWith(slot + ':'));
                return found ? found.split(':')[1] : null;
            };

            const renderSlot = (slotSuffix, label) => {
                const slotId = team + '_' + slotSuffix;
                const player = getPlayer(slotId);
                const isOccupied = !!player;
                const colorClass = team === 'A' ? 'bg-primary border-white text-ink' : 'bg-red-500 border-white text-white';
                return `
                <div class="flex flex-col items-center cursor-pointer relative z-10" onclick="anotarseEnPosicion('${matchId}', '${slotId}')">
                    <div class="w-8 h-8 rounded-full ${isOccupied ? colorClass + ' border-2 shadow-lg scale-110' : 'border-2 border-white/30 border-dashed bg-white/10 text-white/50 hover:bg-white/20'} flex items-center justify-center text-[10px] font-extrabold transition-all" title="${label}">${label}</div>
                    <span class="text-[9px] ${isOccupied ? 'text-white/90 font-bold' : 'text-white/30 font-medium'} mt-1 truncate w-14 text-center" style="transform: ${team === 'B' ? 'rotate(180deg)' : 'none'}">${player || 'Vacante'}</span>
                </div>`;
            };

            if (matchType === 'F7') {
                return `
                    <div class="flex justify-center w-full mb-2">${renderSlot('FW', 'FW')}</div>
                    <div class="flex justify-around w-full px-2">${renderSlot('MC1', 'MC')}${renderSlot('MC2', 'MC')}${renderSlot('MC3', 'MC')}</div>
                    <div class="flex justify-around w-full px-8">${renderSlot('DF1', 'DF')}${renderSlot('DF2', 'DF')}</div>
                    <div class="flex justify-center w-full mt-2">${renderSlot('GK', 'GK')}</div>
                `;
            } else if (matchType === 'F11') {
                return `
                    <div class="flex justify-around w-full px-12 mb-1">${renderSlot('FW1', 'DC')}${renderSlot('FW2', 'DC')}</div>
                    <div class="flex justify-between w-full px-2">${renderSlot('MC1', 'MI')}${renderSlot('MC2', 'MC')}${renderSlot('MC3', 'MC')}${renderSlot('MC4', 'MD')}</div>
                    <div class="flex justify-between w-full px-0">${renderSlot('DF1', 'LI')}${renderSlot('DF2', 'DFC')}${renderSlot('DF3', 'DFC')}${renderSlot('DF4', 'LD')}</div>
                    <div class="flex justify-center w-full mt-1">${renderSlot('GK', 'GK')}</div>
                `;
            } else {
                return `
                    <div class="flex justify-center w-full mb-2">${renderSlot('FW', 'FW')}</div>
                    <div class="flex justify-around w-full px-10">${renderSlot('MC1', 'MC')}${renderSlot('MC2', 'MC')}</div>
                    <div class="flex justify-center w-full">${renderSlot('DF', 'DF')}</div>
                    <div class="flex justify-center w-full mt-2">${renderSlot('GK', 'GK')}</div>
                `;
            }
        };

        window.anotarseEnPosicion = async function (matchId, slotId) {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { alert("Debes iniciar sesión."); return; }
            const nombre = user.user_metadata?.first_name || user.email.split('@')[0];
            AppState.currentUser = nombre;

            if (!AppState.anotados[matchId]) AppState.anotados[matchId] = [];
            let lista = AppState.anotados[matchId];

            const existingIndex = lista.findIndex(a => a.endsWith(':' + nombre));
            let oldSlotId = null;
            if (existingIndex !== -1) {
                oldSlotId = lista[existingIndex].split(':')[0];
                lista.splice(existingIndex, 1);
            }

            const slotIndex = lista.findIndex(a => a.startsWith(slotId + ':'));
            if (slotIndex !== -1) {
                const ocupante = lista[slotIndex].split(':')[1];
                if (ocupante === nombre) {
                    lista.splice(slotIndex, 1);
                    addNotification('Desanotado', 'Te has desanotado de la posición.', 'sports_soccer');
                } else {
                    alert('Esa posición ya está ocupada por ' + ocupante);
                    if (oldSlotId) {
                        lista.push(oldSlotId + ':' + nombre);
                    }
                    return;
                }
            } else {
                lista.push(slotId + ':' + nombre);
                addNotification('Posición elegida', 'Te has anotado como ' + slotId.split('_')[1], 'sports_soccer');
            }

            try {
                const { error } = await supabase.from('matches').update({ players: lista }).eq('id', matchId);
                if (error) throw error;
                renderEvents();
            } catch (e) {
                alert("Error al actualizar posición: " + e.message);
            }
        };

        window.bajarmeDelPartido = async function (matchId) {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { alert("Debes iniciar sesión."); return; }
            const nombre = user.user_metadata?.first_name || user.email.split('@')[0];

            if (!AppState.anotados[matchId]) return;
            let lista = AppState.anotados[matchId];
            const existingIndex = lista.findIndex(a => a.endsWith(':' + nombre));
            if (existingIndex !== -1) {
                lista.splice(existingIndex, 1);
                try {
                    const { error } = await supabase.from('matches').update({ players: lista }).eq('id', matchId);
                    if (error) throw error;
                    addNotification('Desanotado', 'Te has desanotado del partido.', 'sports_soccer');
                    renderEvents();
                } catch (e) {
                    alert("Error al desanotarse: " + e.message);
                }
            }
        };

        function startCountdown(targetDateTimeStr) {
            const countdownEl = document.getElementById('match-countdown');
            if (!countdownEl) return;

            function update() {
                const target = new Date(targetDateTimeStr);
                const now = new Date();
                const diff = target - now;

                if (diff <= 0) {
                    countdownEl.innerHTML = `<span class="inline-flex items-center gap-1.5 text-red-500 font-bold"><span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> En juego / Terminado</span>`;
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                let text = '';
                if (days > 0) text += `${days}d `;
                text += `${hours}h ${minutes}m`;

                countdownEl.innerHTML = `<span class="inline-flex items-center gap-1.5 text-primary font-bold"><span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,200,83,0.8)]"></span> En ${text}</span>`;
            }

            update();
            if (window.countdownInterval) clearInterval(window.countdownInterval);
            window.countdownInterval = setInterval(update, 60000);
        }

        function renderEvents() {
            // Render Fútbol
            const soccerContainer = document.getElementById('dynamic-soccer-list');
            const soccerStatusContainer = document.getElementById('dynamic-soccer-status');
            const soccerHeroContainer = document.getElementById('dynamic-soccer-hero');

            if (soccerContainer && AppState.soccer.length > 0) {
                const nextMatch = AppState.soccer[0];
                const anotadosNext = AppState.anotados && AppState.anotados[nextMatch.id] ? AppState.anotados[nextMatch.id] : [];
                const confirmadosNext = anotadosNext.length;
                const yaAnotadoNext = anotadosNext.some(a => a.endsWith(':' + AppState.currentUser));
                
                let matchType = nextMatch.match_type;
                if (!matchType) {
                    if (nextMatch.title.includes('[F7]')) matchType = 'F7';
                    else if (nextMatch.title.includes('[F11]')) matchType = 'F11';
                    else matchType = 'F5';
                }
                const displayTitleNext = nextMatch.title.replace(/^\[F\d+\]\s*/, '');
                const totalMatch = matchType === 'F11' ? 22 : matchType === 'F7' ? 14 : 10;
                const statusColorNext = confirmadosNext >= totalMatch ? 'text-primary' : confirmadosNext >= totalMatch * 0.7 ? 'text-yellow-500' : 'text-textMuted';

                if (soccerHeroContainer) {
                    soccerHeroContainer.innerHTML = `
                    <div class="glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-xl">
                        <div class="md:w-5/12 h-64 md:h-auto bg-cover bg-center"
                            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD585zDDFPLft8kMFPaJAyqX6jRxpjsnjf65UgkTtsjXX16MgIlNG-_ofxb5L0_oDc26PeYmjzB_XcxoBn0aI9_dYAbnyFtzZcuCwMIUlJtRPpyy3lw3TLA_PSAVh2_3gvGE79CHpenxLDTGt91pOx6fratCmMKDj-ZsQDAe6Fv2wD7ToOi1_B4Uc8rUMN-p3GeJlBpPOeaQCJHZPbN2WZ7KqNHJlcJ8lIQ-uYBqW7043kuJsUEBmciUFJUGiggG8nX6Tg3zf8i88U');">
                        </div>
                        <div class="p-8 md:p-12 md:w-7/12 flex flex-col justify-center bg-white">
                            <div class="flex items-center gap-3 mb-6">
                                <span class="bg-primary/10 text-primaryDark px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">${matchType === 'F7' ? 'Fútbol 7' : matchType === 'F11' ? 'Fútbol 11' : 'Fútbol 5'}</span>
                                <span class="flex items-center gap-1 text-textMuted font-bold text-xs uppercase tracking-wider">
                                    <span class="material-symbols-rounded text-[18px]">public</span> Público
                                </span>
                            </div>
                            <h1 class="text-3xl md:text-5xl font-extrabold text-ink mb-4 leading-tight tracking-tight">${displayTitleNext}</h1>
                            <p class="text-lg text-textMuted mb-8 leading-relaxed">El próximo gran partido. Trae tu mejor nivel, zapatillas de pasto sintético y cero excusas. ¿Quién paga las bebidas?</p>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="flex items-start gap-4">
                                    <div class="bg-primary/10 p-3 rounded-full flex items-center justify-center shrink-0">
                                        <span class="material-symbols-rounded text-primary">calendar_month</span>
                                    </div>
                                    <div>
                                        <div class="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">FECHA Y HORA</div>
                                        <div class="text-lg font-bold text-ink leading-tight">${nextMatch.date}<br>${nextMatch.time}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="bg-primary/10 p-3 rounded-full flex items-center justify-center shrink-0">
                                        <span class="material-symbols-rounded text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <div class="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">UBICACIÓN</div>
                                        <div class="text-lg font-bold text-ink leading-tight">${nextMatch.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }

                if (soccerStatusContainer) {
                    soccerStatusContainer.innerHTML = `
                        <div class="glass-card rounded-[2rem] p-8 flex flex-col border-t-4 border-t-primary shadow-xl">
                            <h2 class="text-xl font-bold text-ink mb-4">Estado del Partido</h2>
                            <div class="flex items-baseline gap-2 mb-8 border-b border-borderLight pb-6">
                                <span class="text-5xl font-extrabold text-ink">${confirmadosNext}</span>
                                <span class="text-sm font-bold text-textMuted">/ ${totalMatch} Confirmados</span>
                            </div>
                            <div class="flex flex-col gap-5 mb-8">
                                ${anotadosNext.length > 0 ? anotadosNext.map(item => {
                        const parts = item.split(':');
                        const slot = parts[0];
                        const u = parts[1];
                        const isTeamA = slot.startsWith('A_');
                        return `
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full ${isTeamA ? 'bg-primary/20 text-primaryDark' : 'bg-red-100 text-red-600'} flex items-center justify-center font-bold">${u.substring(0, 1).toUpperCase()}</div>
                                            <span class="font-bold text-ink">${u} <span class="text-[10px] text-textMuted uppercase">(${slot.split('_')[1]})</span></span>
                                        </div>
                                        <span class="font-bold text-xs ${isTeamA ? 'text-primary' : 'text-red-500'} uppercase">${isTeamA ? 'Local' : 'Rival'}</span>
                                    </div>
                                    `;
                    }).join('') : '<p class="text-sm text-textMuted">Aún no hay anotados.</p>'}
                            </div>
                            <div class="border-t border-borderLight pt-6 mb-6">
                                <p class="text-xs font-bold text-textMuted uppercase tracking-widest mb-3">Táctica ${matchType} ${confirmadosNext >= totalMatch ? 'Confirmada' : 'Parcial'} <span class="text-primary normal-case font-medium">- Haz clic para anotarte</span></p>
                                <div class="relative w-full rounded-2xl overflow-hidden flex flex-col justify-between border border-emerald-900 bg-gradient-to-b from-[#113022] to-[#04120c] text-white shadow-inner" style="min-height: 480px; padding-bottom: 1rem; padding-top: 1rem;">
                                    <div class="absolute inset-2 border border-white/10 pointer-events-none rounded-lg"></div>
                                    <div class="absolute top-1/2 left-0 right-0 h-px bg-white/10 pointer-events-none"></div>
                                    <div class="absolute top-1/2 left-1/2 w-24 h-24 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                                    <div class="absolute bottom-2 left-1/2 w-40 h-20 border border-white/10 rounded-t-lg -translate-x-1/2 pointer-events-none"></div>
                                    <div class="absolute top-2 left-1/2 w-40 h-20 border border-white/10 rounded-b-lg -translate-x-1/2 pointer-events-none"></div>
                                    
                                    <!-- EQUIPO B (Rival) -->
                                    <div class="relative z-10 flex flex-col justify-between h-1/2 w-full px-2 rotate-180 pt-2 pb-6">
                                        ${renderTeamSlots(nextMatch.id, 'B', matchType, anotadosNext)}
                                    </div>
                                    
                                    <!-- EQUIPO A (Local) -->
                                    <div class="relative z-10 flex flex-col justify-between h-1/2 w-full px-2 pt-6 pb-2">
                                        ${renderTeamSlots(nextMatch.id, 'A', matchType, anotadosNext)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                soccerContainer.innerHTML = AppState.soccer.map(match => {
                    const anotados = AppState.anotados && AppState.anotados[match.id] ? AppState.anotados[match.id] : [];
                    const yaAnotado = anotados.some(a => a.endsWith(':' + AppState.currentUser));
                    
                    let mt = match.match_type;
                    if (!mt) {
                        if (match.title.includes('[F7]')) mt = 'F7';
                        else if (match.title.includes('[F11]')) mt = 'F11';
                        else mt = 'F5';
                    }
                    const displayTitle = match.title.replace(/^\[F\d+\]\s*/, '');
                    const total = mt === 'F11' ? 22 : mt === 'F7' ? 14 : 10;
                    const confirmados = anotados.length;
                    const pct = Math.round((confirmados / total) * 100);
                    const statusColor = confirmados >= total ? 'text-primary' : confirmados >= total * 0.7 ? 'text-yellow-500' : 'text-textMuted';
                    return `
                    <div class="bg-white border border-borderLight rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                        <div class="flex flex-col gap-4">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="inline-flex items-center gap-1.5 bg-primary/10 text-primaryDark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            <span class="material-symbols-rounded text-[14px]">sports_soccer</span> ${mt === 'F7' ? 'Fútbol 7' : mt === 'F11' ? 'Fútbol 11' : 'Fútbol 5'}
                                        </div>
                                        <div class="flex items-center gap-1 ml-auto">
                                            <button onclick="editMatch('${match.id}')" class="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                                                <span class="material-symbols-rounded text-[16px]">edit</span>
                                            </button>
                                            <button onclick="deleteMatch('${match.id}')" class="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors">
                                                <span class="material-symbols-rounded text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <h3 class="text-xl font-extrabold text-ink">${displayTitle}</h3>
                                </div>
                                <div class="shrink-0 text-right">
                                    <p class="text-xs font-bold text-textMuted mb-2">Posiciónate en la táctica para anotarte</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 text-textMuted text-sm">
                                <div class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-borderLight">
                                    <span class="material-symbols-rounded text-[16px] text-primary">calendar_today</span> ${match.date}
                                </div>
                                <div class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-borderLight">
                                    <span class="material-symbols-rounded text-[16px] text-primary">schedule</span> ${match.time}
                                </div>
                                <div class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-borderLight">
                                    <span class="material-symbols-rounded text-[16px] text-primary">location_on</span> ${match.location}
                                </div>
                            </div>
                            <div class="border-t border-borderLight pt-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-bold text-textMuted">Confirmados</span>
                                    <span class="text-sm font-extrabold ${statusColor}">${confirmados} / ${total}</span>
                                </div>
                                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary rounded-full transition-all duration-700" style="width:${pct}%"></div>
                                </div>
                                ${anotados.length > 0 ? `<div class="mt-3 flex flex-wrap gap-1">${anotados.map(a => `<span class="text-xs bg-primary/10 text-primaryDark font-semibold px-2.5 py-1 rounded-full">${a.split(':')[1]}</span>`).join('')}</div>` : ''}
                                ${yaAnotado ? `
                                    <button onclick="bajarmeDelPartido('${match.id}')" class="mt-3 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-200">
                                        <span class="material-symbols-rounded text-[14px]">logout</span> Bajarme del Partido
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>`;
                }).join('');
            } else {
                if (soccerContainer) {
                    soccerContainer.innerHTML = `
                    <div class="glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-xl">
                        <div class="p-8 md:p-12 w-full flex flex-col justify-center text-center items-center bg-white relative overflow-hidden">
                            <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                                <span class="material-symbols-rounded text-[200px]">sports_soccer</span>
                            </div>
                            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-textMuted relative z-10">
                                <span class="material-symbols-rounded text-[40px]">sentiment_dissatisfied</span>
                            </div>
                            <h1 class="text-3xl md:text-5xl font-extrabold text-ink mb-4 leading-tight tracking-tight relative z-10">Falta Fútbol...</h1>
                            <p class="text-lg text-textMuted mb-8 leading-relaxed max-w-xl relative z-10">
                                Hace rato que no pisamos la cancha. Tenemos que jugar más seguido, organizar un torneo o aunque sea un picadito para no perder el toque. ¿Quién organiza el próximo?
                            </p>
                            <button onclick="openModal(); showForm('soccer')" class="bg-ink text-white font-bold px-8 py-4 rounded-full hover:bg-primary transition-all shadow-lg magnetic-btn relative z-10">
                                Armar Partido Ahora
                            </button>
                        </div>
                    </div>
                `;
                }
                if (soccerStatusContainer) {
                    let memberNames = [];
                    if (AppState.birthdays) {
                        memberNames = AppState.birthdays
                            .filter(b => b.name.startsWith('[MEMBER]'))
                            .map(b => b.name.replace('[MEMBER] ', ''));
                    }

                    // Add current logged in user if not present
                    if (AppState.currentUser && !memberNames.includes(AppState.currentUser)) {
                        memberNames.push(AppState.currentUser);
                    }

                    if (memberNames.length > 0) {
                        const membersListHtml = memberNames.map((name, index) => {
                            const initial = name.substring(0, 1).toUpperCase();
                            const gradients = [
                                'from-emerald-400 to-green-600',
                                'from-blue-400 to-indigo-600',
                                'from-amber-400 to-orange-600',
                                'from-pink-400 to-rose-600',
                                'from-violet-400 to-purple-600',
                                'from-cyan-400 to-teal-600'
                            ];
                            const grad = gradients[index % gradients.length];
                            return `
                                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100/80 transition-colors border border-slate-100/50">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br ${grad} text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        ${initial}
                                    </div>
                                    <span class="font-bold text-slate-700 text-sm">${name}</span>
                                </div>
                            `;
                        }).join('');

                        soccerStatusContainer.innerHTML = `
                            <div class="bg-white border border-borderLight rounded-[2rem] p-6 shadow-sm flex flex-col gap-5">
                                <div>
                                    <h3 class="text-lg font-extrabold text-ink">Miembros de la App</h3>
                                    <p class="text-xs text-textMuted mt-1">Gente registrada y lista para el picadito.</p>
                                </div>
                                <div class="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
                                    ${membersListHtml}
                                </div>
                            </div>
                        `;
                    } else {
                        soccerStatusContainer.innerHTML = '';
                    }
                }
                
                renderPastSoccer();
            }

            // Render Juntadas
            const hangoutsContainer = document.getElementById('dynamic-hangouts-list');
            if (hangoutsContainer && AppState.hangouts.length > 0) {
                hangoutsContainer.innerHTML = AppState.hangouts.map(hangout => `
                <div class="bg-white border border-borderLight rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-md transition-all group">
                        <div class="flex-grow">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="text-xl font-extrabold text-ink">${hangout.title}</h3>
                                <div class="flex items-center gap-1">
                                    <button onclick="editHangout('${hangout.id}')" class="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                                        <span class="material-symbols-rounded text-[16px]">edit</span>
                                    </button>
                                    <button onclick="deleteHangout('${hangout.id}')" class="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors">
                                        <span class="material-symbols-rounded text-[16px]">delete</span>
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-3 text-sm text-textMuted">
                                <span class="flex items-center gap-1.5"><span class="material-symbols-rounded text-[16px] text-primary">event</span>${hangout.date} · ${hangout.time}</span>
                                <span class="flex items-center gap-1.5"><span class="material-symbols-rounded text-[16px] text-primary">restaurant</span>${(hangout.food_options || []).join(', ')}</span>
                            </div>
                        </div>
                        <button onclick="abrirDetallesJuntada('${hangout.id}')" class="shrink-0 w-full md:w-auto px-6 py-3 bg-white border-2 border-ink rounded-full text-ink font-bold hover:bg-ink hover:text-white transition-all">
                            Ver Detalles
                        </button>
                    </div>
                `).join('');
            } else if (hangoutsContainer) {
                hangoutsContainer.innerHTML = '<p class="text-textMuted p-4">No hay juntadas creadas aún.</p>';
            }

            // Render Cumpleaños
            const bdayHeroContainer = document.getElementById('dynamic-birthday-hero');
            const bdaysGridContainer = document.getElementById('dynamic-birthdays-grid');

            const birthdaysOnlyList = AppState.birthdays.filter(b => !b.name.startsWith('[MEMBER]'));
            if ((bdayHeroContainer || bdaysGridContainer) && birthdaysOnlyList.length > 0) {
                // Process and sort
                const processedBdays = birthdaysOnlyList.map((bday, idx) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const birth = new Date(bday.birth_date + 'T00:00:00');

                    let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
                    if (nextBday < today) {
                        nextBday.setFullYear(today.getFullYear() + 1);
                    }

                    const diffTime = nextBday - today;
                    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    return {
                        ...bday,
                        birthDateObj: birth,
                        nextBdayObj: nextBday,
                        daysLeft: daysLeft,
                        index: idx
                    };
                });

                processedBdays.sort((a, b) => a.daysLeft - b.daysLeft);

                const nearest = processedBdays[0];

                // 1. Render Hero Card
                if (bdayHeroContainer && nearest) {
                    const isToday = nearest.daysLeft === 0;
                    bdayHeroContainer.innerHTML = `
                        <div class="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border ${isToday ? 'border-primary bg-gradient-to-br from-[#0c2a1a] via-[#05180f] to-slate-950 text-white shadow-2xl shadow-primary/10' : 'border-slate-100 bg-white shadow-sm'} flex flex-col md:flex-row justify-between items-center gap-8 group">
                            <!-- Background elements -->
                            <div class="absolute -right-20 -bottom-20 w-80 h-80 ${isToday ? 'bg-primary/10' : 'bg-slate-50'} rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 text-center md:text-left">
                                <div class="w-24 h-24 rounded-full ${isToday ? 'bg-primary/20 border-2 border-primary text-primary animate-pulse' : 'bg-slate-50 border border-slate-100'} flex items-center justify-center text-5xl shrink-0 shadow-inner">
                                    ${isToday ? '🎂' : '🎈'}
                                </div>
                                <div>
                                    <div class="inline-flex items-center gap-1.5 ${isToday ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-500'} text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
                                        <span class="w-2 h-2 rounded-full ${isToday ? 'bg-primary animate-ping' : 'bg-slate-400'}"></span>
                                        ${isToday ? '¡CUMPLE HOY! 🎉' : 'PRÓXIMO CUMPLE'}
                                    </div>
                                    <h2 class="text-3xl font-extrabold ${isToday ? 'text-white' : 'text-slate-900'}">${nearest.name}</h2>
                                    <p class="text-base ${isToday ? 'text-slate-300' : 'text-slate-500'} mt-1">
                                        ${nearest.birthDateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                                    </p>
                                    <p class="text-sm font-bold mt-2 ${isToday ? 'text-primary' : 'text-slate-600'}">
                                        ${isToday ? '¡Hoy es su día especial! Dejale tus saludos' : `Faltan ${nearest.daysLeft} día${nearest.daysLeft !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="shrink-0 w-full md:w-auto relative z-10 flex flex-col gap-3">
                                <div class="flex gap-2 w-full md:w-auto">
                                    <button onclick="editBirthday('${nearest.id}')" class="w-12 h-12 rounded-full border-2 ${isToday ? 'border-primary/50 text-primary hover:bg-primary/20' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-primary hover:border-primary/50'} flex items-center justify-center transition-all shrink-0 bg-white shadow-sm" title="Editar Cumpleaños">
                                        <span class="material-symbols-rounded">edit</span>
                                    </button>
                                    <button onclick="desearCumpleanos(this, '${nearest.name}')" class="flex-1 px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${isToday ? 'border-primary bg-primary text-ink hover:bg-primaryDark hover:border-primaryDark' : 'border-ink bg-ink text-white hover:bg-primary hover:text-ink hover:border-primary'} shadow-lg transform hover:-translate-y-0.5">
                                        <span class="material-symbols-rounded">celebration</span> Saludar con Confetti
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // 2. Render Grid for other birthdays
                if (bdaysGridContainer) {
                    const remainingBdays = processedBdays.slice(1);
                    if (remainingBdays.length > 0) {
                        bdaysGridContainer.innerHTML = remainingBdays.map(bday => {
                            const initial = bday.name.substring(0, 1).toUpperCase();
                            const gradients = [
                                'from-emerald-400 to-green-600',
                                'from-blue-400 to-indigo-600',
                                'from-amber-400 to-orange-600',
                                'from-pink-400 to-rose-600',
                                'from-violet-400 to-purple-600',
                                'from-cyan-400 to-teal-600'
                            ];
                            const grad = gradients[bday.index % gradients.length];

                            return `
                                <div class="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all relative group">
                                    <div class="w-14 h-14 rounded-full bg-gradient-to-br ${grad} text-white flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0 relative z-0">
                                        ${initial}
                                    </div>
                                    <div class="flex-grow min-w-0">
                                        <h4 class="font-extrabold text-ink text-base truncate" title="${bday.name}">${bday.name}</h4>
                                        <p class="text-xs font-semibold text-slate-400 mt-0.5">
                                            ${bday.birthDateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                    <div class="shrink-0 flex items-center gap-2">
                                        <button onclick="editBirthday('${bday.id}')" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 z-10" title="Editar Cumpleaños">
                                            <span class="material-symbols-rounded text-[16px]">edit</span>
                                        </button>
                                        <span class="inline-flex bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full">
                                            En ${bday.daysLeft} d
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        bdaysGridContainer.innerHTML = `
                            <div class="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <span class="material-symbols-rounded text-4xl text-slate-300 mb-2">cake</span>
                                <p class="text-sm font-medium">No hay más cumpleaños agendados.</p>
                            </div>
                        `;
                    }
                }
            } else {
                if (bdayHeroContainer) {
                    bdayHeroContainer.innerHTML = `
                        <div class="py-12 text-center text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                            <span class="material-symbols-rounded text-4xl text-slate-300 mb-2">cake</span>
                            <p class="text-sm font-medium">No hay ningún cumpleaños registrado.</p>
                        </div>
                    `;
                }
                if (bdaysGridContainer) {
                    bdaysGridContainer.innerHTML = '';
                }
            }

            // Render Home Content (Inicio) - Updates Calendar Section
            const homeContainer = document.getElementById('home-content');
            if (homeContainer) {
                let html = '';

                // 1. Next Soccer Match
                if (AppState.soccer.length > 0) {
                    const match = AppState.soccer[0];
                    const matchTypeLabel = match.match_type === 'F7' ? 'Fútbol 7' : match.match_type === 'F11' ? 'Fútbol 11' : 'Fútbol 5';
                    const mainText = match.match_type || 'F5';
                    const anotadosHome = AppState.anotados && AppState.anotados[match.id] ? AppState.anotados[match.id] : [];
                    const confirmadosHome = anotadosHome.length;
                    const totalHome = match.match_type === 'F11' ? 22 : match.match_type === 'F7' ? 14 : 10;
                    const pctHome = Math.min(100, Math.round((confirmadosHome / totalHome) * 100));
                    const yaAnotadoHome = anotadosHome.some(a => a.endsWith(':' + AppState.currentUser));

                    const avatarsHtml = anotadosHome.slice(0, 5).map(a => {
                        const name = a.split(':')[1];
                        const initial = name ? name.substring(0, 1).toUpperCase() : '?';
                        return `<div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold -ml-2 first:ml-0 text-slate-200" title="${name}">${initial}</div>`;
                    }).join('');
                    const extraCount = anotadosHome.length > 5 ? `<div class="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-extrabold -ml-2 text-slate-400">+${anotadosHome.length - 5}</div>` : '';

                    html += `
                        <div class="col-span-1 lg:col-span-8 bg-slate-950 border border-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl min-h-[420px] transition-all duration-300 hover:border-slate-800">
                            <!-- Background Radial Glows -->
                            <div class="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-primary/15"></div>
                            <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00c853]/15 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-[#00c853]/20"></div>
                            
                            <!-- Tactical field lines SVG watermark -->
                            <svg viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[50%] h-[80%] text-primary opacity-[0.03] max-w-sm rotate-[-15deg] pointer-events-none transition-all duration-500 group-hover:opacity-[0.05]">
                                <rect x="10" y="10" width="380" height="280" rx="15" />
                                <line x1="200" y1="10" x2="200" y2="290" />
                                <circle cx="200" cy="150" r="55" />
                            </svg>

                            <div class="flex justify-between items-start gap-4 mb-10 relative z-10">
                                <div>
                                    <div class="inline-flex items-center gap-2 bg-primary/15 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-6 shadow-sm">
                                        <span class="material-symbols-rounded text-[18px]">sports_soccer</span> ${matchTypeLabel}
                                    </div>
                                    <h2 class="text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">${mainText}</h2>
                                    <p class="text-lg text-slate-300 mt-2 font-medium">${match.title}</p>
                                </div>
                                
                                <!-- Countdown Badge -->
                                <div id="match-countdown" class="bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-full text-xs font-semibold shrink-0 shadow-inner">
                                    Cargando tiempo...
                                </div>
                            </div>
                            
                            <!-- Mid row: Match detail cards -->
                            <div class="flex flex-wrap gap-4 mb-8 relative z-10">
                                <div class="bg-slate-900/60 border border-slate-800/50 backdrop-blur-md rounded-2xl p-4 min-w-[130px] flex-grow sm:flex-grow-0">
                                    <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Fecha</p>
                                    <p class="text-base font-extrabold text-white">${match.date}</p>
                                </div>
                                <div class="bg-slate-900/60 border border-slate-800/50 backdrop-blur-md rounded-2xl p-4 min-w-[130px] flex-grow sm:flex-grow-0">
                                    <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Hora</p>
                                    <p class="text-base font-extrabold text-white">${match.time}</p>
                                </div>
                                <div class="bg-slate-900/60 border border-slate-800/50 backdrop-blur-md rounded-2xl p-4 min-w-[150px] flex-grow sm:flex-grow-0">
                                    <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Ubicación</p>
                                    <p class="text-base font-extrabold text-white">${match.location}</p>
                                </div>
                            </div>

                            <!-- Bottom row: Convocatoria and button -->
                            <div class="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-end relative z-10 border-t border-slate-900 pt-6">
                                <div class="flex-grow">
                                    <div class="flex items-center justify-between gap-4 mb-2.5">
                                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Convocatoria (${confirmadosHome}/${totalHome})</span>
                                        <span class="text-xs font-extrabold text-primary">${pctHome}%</span>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="flex-grow h-2.5 bg-slate-900 border border-slate-800/50 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-primary to-[#00c853] rounded-full shadow-[0_0_8px_rgba(0,200,83,0.5)] transition-all duration-700" style="width:${pctHome}%"></div>
                                        </div>
                                        
                                        <!-- Avatars overlapping -->
                                        <div class="flex items-center shrink-0">
                                            ${avatarsHtml}
                                            ${extraCount}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-3 shrink-0">
                                    ${yaAnotadoHome ? `
                                        <button onclick="bajarmeDelPartido('${match.id}')" class="bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-6 py-3.5 rounded-full hover:bg-red-500 hover:text-white transition-all text-sm flex items-center gap-2">
                                            <span class="material-symbols-rounded text-[18px]">logout</span> Bajarme
                                        </button>
                                    ` : `
                                        <button onclick="switchView('soccer')" class="bg-primary text-ink font-bold px-8 py-3.5 rounded-full hover:bg-primaryDark transition-all text-sm shadow-[0_0_15px_rgba(0,200,83,0.2)] hover:shadow-[0_0_25px_rgba(0,200,83,0.4)]">
                                            Anotarme Ahora
                                        </button>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="col-span-1 lg:col-span-8 glass-card rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center items-center text-center shadow-xl min-h-[400px]">
                            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-primary">
                                <span class="material-symbols-rounded text-[40px]">sports_soccer</span>
                            </div>
                            <h2 class="text-3xl font-extrabold text-ink mb-4">No hay partidos próximos</h2>
                            <p class="text-textMuted mb-8">Organiza el próximo encuentro con tu equipo.</p>
                            <button onclick="openModal(); showForm('soccer')" class="bg-ink text-white font-bold px-8 py-4 rounded-full hover:bg-primary transition-all shadow-lg magnetic-btn">
                                Crear Partido
                            </button>
                        </div>
                    `;
                }

                html += '<div class="col-span-1 lg:col-span-4 flex flex-col gap-8">';

                // 2. Next Hangout
                if (AppState.hangouts.length > 0) {
                    const hangout = AppState.hangouts[0];
                    html += `
                        <div class="glass-card rounded-[2.5rem] p-10 flex-grow border-t-4 border-t-primary relative overflow-hidden group shadow-xl">
                            <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <span class="material-symbols-rounded text-[100px]">local_cafe</span>
                            </div>
                            <div class="inline-flex items-center gap-2 bg-primary/10 text-primaryDark font-bold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                                <span class="material-symbols-rounded text-[18px]">local_cafe</span> Juntadas
                            </div>
                            <h3 class="text-2xl md:text-3xl font-extrabold text-ink mb-4 leading-snug tracking-tight">${hangout.title}</h3>
                            <p class="text-base text-textMuted mb-10 font-medium leading-relaxed">${(hangout.food_options || []).join(', ') || 'Sin opciones definidas'}</p>
                            <div class="flex items-center gap-3 text-ink font-bold mt-auto bg-white/50 w-fit px-5 py-3 rounded-2xl text-lg cursor-pointer hover:bg-white transition-colors" onclick="switchView('hangouts')">
                                <span class="material-symbols-rounded text-[24px] text-primary">schedule</span>
                                ${hangout.date}, ${hangout.time}
                            </div>
                        </div>
                    `;
                }

                // 3. Next Birthday
                const birthdaysOnly = AppState.birthdays.filter(b => !b.name.startsWith('[MEMBER]'));
                if (birthdaysOnly.length > 0) {
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    // Find all closest upcoming birthdays
                    let nextBdays = [];
                    let minDays = Infinity;

                    birthdaysOnly.forEach(bday => {
                        const birth = new Date(bday.birth_date + 'T00:00:00');
                        const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
                        if (next < today) next.setFullYear(today.getFullYear() + 1);
                        const days = Math.round((next - today) / 86400000);
                        if (days < minDays) {
                            minDays = days;
                            nextBdays = [bday];
                        } else if (days === minDays) {
                            nextBdays.push(bday);
                        }
                    });

                    if (nextBdays.length > 0) {
                        html += `
                            <div class="bg-ink rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl group flex flex-col justify-between">
                                <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                                    <span class="material-symbols-rounded text-[120px]">cake</span>
                                </div>
                                <h3 class="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 relative z-10">Próximo Cumpleaños</h3>
                                
                                <div class="flex flex-col gap-4 mb-6 relative z-10 w-full">
                                    ${nextBdays.map(bday => `
                                    <div class="flex items-center gap-5 bg-white/5 p-4 rounded-2xl">
                                        <div class="w-14 h-14 rounded-full border-2 border-primary bg-white/10 flex items-center justify-center text-2xl shrink-0">🎂</div>
                                        <div>
                                            <p class="text-lg font-bold">${bday.name}</p>
                                            <p class="text-xs font-medium text-primary mt-1">${minDays === 0 ? '¡Cumple hoy!' : 'Faltan ' + minDays + ' días'}</p>
                                        </div>
                                    </div>
                                    `).join('')}
                                </div>
                                
                                <button onclick="switchView('birthdays')" class="w-full bg-white/10 hover:bg-primary border border-white/20 hover:border-primary text-white hover:text-ink font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10 magnetic-btn backdrop-blur-sm mt-auto">
                                    Ver Todos
                                </button>
                            </div>
                        `;
                    }
                }

                html += '</div>'; // End col-span-4

                // 4. App Members (El Plantel)
                let memberNames = [];
                if (AppState.birthdays) {
                    memberNames = AppState.birthdays
                        .filter(b => b.name.startsWith('[MEMBER]'))
                        .map(b => b.name.replace('[MEMBER] ', ''));
                }

                // Add current logged in user if not present
                if (AppState.currentUser && !memberNames.includes(AppState.currentUser)) {
                    memberNames.push(AppState.currentUser);
                }

                if (memberNames.length > 0) {
                    const membersHtml = memberNames.map((name, index) => {
                        // Buscar jersey number del miembro (por nombre en Supabase metadata o en AppState)
                        const memberJersey = AppState.memberJerseys && AppState.memberJerseys[name];
                        const isCurrentUser = name === AppState.currentUser;
                        const jerseyNum = isCurrentUser && AppState.userJerseyNumber
                            ? AppState.userJerseyNumber
                            : (memberJersey || null);

                        return `
                    <div class="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300 relative group overflow-hidden cursor-pointer hover:-translate-y-1">
                        <div class="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
                        <!-- Mini camiseta del miembro -->
                        <div style="width:72px;height:72px;background:#111;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;margin-bottom:12px;border:2px solid #1f1f1f;box-shadow:0 4px 16px rgba(0,0,0,0.3);flex-shrink:0;position:relative;z-index:1;transition:transform 0.3s ease;" class="group-hover:scale-110">
                            <span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:${jerseyNum && jerseyNum >= 10 ? '1.6rem' : '2rem'};line-height:1;color:#f5c800;text-shadow:0 0 12px rgba(245,200,0,0.5);">${jerseyNum !== null ? jerseyNum : '?'}</span>
                            <span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:0.4rem;letter-spacing:0.12em;color:#f5c800;opacity:0.6;">F5</span>
                        </div>
                        <h4 class="font-extrabold text-slate-800 text-sm truncate w-full relative z-1" title="${name}">
                            ${name}
                        </h4>
                        <p class="text-[10px] font-bold mt-1 uppercase tracking-wider ${jerseyNum ? 'text-amber-500' : 'text-slate-400'}">${jerseyNum ? '#' + jerseyNum : 'Sin número'}</p>
                    </div>
                `;
                    }).join('');

                    html += `
                <div class="col-span-full mt-8 border-t border-slate-100 pt-10">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight">El Plantel</h3>
                            <p class="text-sm text-textMuted mt-1">Los miembros registrados de F5 Martes  14 a 15.</p>
                        </div>
                        <span class="bg-primary/10 text-primaryDark font-extrabold px-4 py-1.5 rounded-full text-xs uppercase">
                            ${memberNames.length} Miembros
                        </span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        ${membersHtml}
                    </div>
                </div>
            `;
                }

                homeContainer.innerHTML = html;

                // Start countdown if next match exists
                if (AppState.soccer.length > 0) {
                    const nextMatch = AppState.soccer[0];
                    setTimeout(() => {
                        startCountdown(nextMatch.date + 'T' + (nextMatch.time || '00:00:00'));
                    }, 50);
                }
            }
        }

        async function handleUpdatePassword(e) {
            e.preventDefault();
            const newPassword = document.getElementById('profile-new-password').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Actualizando...';
            btn.disabled = true;

            try {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
                alert('¡Contraseña actualizada correctamente!');
                document.getElementById('profile-new-password').value = '';
            } catch (error) {
                alert('Error al actualizar contraseña: ' + error.message);
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }

        async function loadProfileName() {
            if (!supabase) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const firstName = user.user_metadata?.first_name || '';
                    const lastName = user.user_metadata?.last_name || '';
                    const fNameInput = document.getElementById('profile-first-name');
                    const lNameInput = document.getElementById('profile-last-name');
                    if (fNameInput) fNameInput.value = firstName;
                    if (lNameInput) lNameInput.value = lastName;
                }
            } catch (err) {
                console.error("Error cargando nombre en perfil:", err);
            }
        }

        async function handleUpdateProfile(e) {
            e.preventDefault();
            if (!supabase) return alert("Error de conexión");

            const newFirstName = document.getElementById('profile-first-name').value.trim();
            const newLastName = document.getElementById('profile-last-name').value.trim();
            if (!newFirstName || !newLastName) return alert("Por favor completa todos los campos");

            const btn = document.getElementById('btn-update-profile');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-rounded animate-spin text-[18px]">progress_activity</span> Guardando...';
            btn.disabled = true;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("No hay usuario autenticado");

                const oldFirstName = user.user_metadata?.first_name || '';
                const oldLastName = user.user_metadata?.last_name || '';

                // 1. Actualizar metadatos en Supabase auth
                const { error: authError } = await supabase.auth.updateUser({
                    data: { first_name: newFirstName, last_name: newLastName }
                });
                if (authError) throw authError;

                // 2. Buscar y actualizar en la tabla 'birthdays' el registro [MEMBER] correspondiente
                const oldFullName = '[MEMBER] ' + oldFirstName + ' ' + oldLastName;
                const newFullName = '[MEMBER] ' + newFirstName + ' ' + newLastName;

                const { data: memberBdays, error: findError } = await supabase
                    .from('birthdays')
                    .select('*')
                    .eq('name', oldFullName);

                if (!findError && memberBdays && memberBdays.length > 0) {
                    const { error: updateError } = await supabase
                        .from('birthdays')
                        .update({ name: newFullName })
                        .eq('id', memberBdays[0].id);
                    if (updateError) console.warn("No se pudo actualizar la tabla de cumpleaños:", updateError.message);
                }

                // 3. Actualizar todas las inscripciones en partidos activos de AppState.soccer
                if (AppState.soccer && AppState.soccer.length > 0) {
                    for (const match of AppState.soccer) {
                        if (match.players && match.players.length > 0) {
                            let updated = false;
                            const newPlayers = match.players.map(playerSlot => {
                                if (playerSlot.endsWith(':' + oldFirstName)) {
                                    updated = true;
                                    const parts = playerSlot.split(':');
                                    return parts[0] + ':' + newFirstName;
                                }
                                return playerSlot;
                            });

                            if (updated) {
                                const { error: matchUpdateErr } = await supabase
                                    .from('matches')
                                    .update({ players: newPlayers })
                                    .eq('id', match.id);
                                if (matchUpdateErr) console.warn(`No se pudo actualizar inscripción en partido ${match.id}:`, matchUpdateErr.message);
                            }
                        }
                    }
                }

                // 4. Actualizar AppState y UI
                AppState.currentUser = newFirstName;
                if (typeof updateMantoData === 'function') {
                    updateMantoData();
                }
                await fetchEvents();

                alert('¡Datos personales actualizados correctamente!');
            } catch (error) {
                alert('Error al actualizar datos: ' + error.message);
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        }

        function selectAvatar(el, position) {
            // Legacy - replaced by jersey number system
            AppState.userAvatarPosition = position;
        }

        // LÓGICA DE MODALES
        function openModal() {
            const overlay = document.getElementById('create-modal-overlay');
            const modal = document.getElementById('create-modal');
            resetModal();
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => {
                overlay.classList.replace('opacity-0', 'opacity-100');
                modal.classList.replace('scale-95', 'scale-100');
            }, 10);
        }

        function closeModal() {
            const overlay = document.getElementById('create-modal-overlay');
            const modal = document.getElementById('create-modal');
            overlay.classList.replace('opacity-100', 'opacity-0');
            modal.classList.replace('scale-100', 'scale-95');
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.classList.remove('flex');
            }, 300);
        }

        function showForm(type) {
            document.getElementById('step-select-type').classList.add('hidden');
            document.getElementById(`form-${type}`).classList.remove('hidden');
            document.getElementById('modal-title').innerText = type === 'soccer' ? 'Crear Partido' : (type === 'hangout' ? 'Crear Juntada' : 'Añadir Cumpleaños');
        }

        function resetModal() {
            document.getElementById('step-select-type').classList.remove('hidden');
            document.getElementById('form-soccer').classList.add('hidden');
            document.getElementById('form-hangout').classList.add('hidden');
            document.getElementById('form-birthday').classList.add('hidden');
            document.getElementById('modal-title').innerText = 'Nuevo Evento';

            document.getElementById('form-soccer').reset();
            document.getElementById('form-hangout').reset();
            document.getElementById('form-birthday').reset();

            const btnSoccer = document.getElementById('btn-submit-soccer');
            if (btnSoccer) btnSoccer.innerText = 'Crear Partido';
            const btnHangout = document.getElementById('btn-submit-hangout');
            if (btnHangout) btnHangout.innerText = 'Crear Juntada';
            const btnBirthday = document.getElementById('btn-submit-birthday');
            if (btnBirthday) btnBirthday.innerText = 'Agregar Cumpleaños';

            delete document.getElementById('form-soccer').dataset.editingId;
            delete document.getElementById('form-hangout').dataset.editingId;
            delete document.getElementById('form-birthday').dataset.editingId;
        }

        async function handleCreateEvent(e, type) {
            e.preventDefault();

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Guardando...';
            submitBtn.disabled = true;

            try {
                if (type === 'soccer') {
                    // Update location input class if valid
                    document.getElementById('f5-location').classList.remove('border-red-500');

                    const title = document.getElementById('f5-title').value;
                    const match_type = document.getElementById('f5-type').value;
                    const date = document.getElementById('f5-date').value;
                    const time = document.getElementById('f5-time').value;
                    const location = document.getElementById('f5-location').value;
                    const editingId = document.getElementById('form-soccer').dataset.editingId;

                    // EASTER EGG: Andá pa allá bobo
                    if (title.toLowerCase().includes('bobo') || location.toLowerCase().includes('bobo')) {
                        triggerBoboEasterEgg();
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        return; // Prevent saving the match
                    }

                    if (editingId) {
                        const { error } = await supabase.from('matches').update({ title, match_type, date, time, location }).eq('id', editingId);
                        if (error) {
                            if (error.message.includes("match_type")) {
                                const { error: err2 } = await supabase.from('matches').update({ title: `[${match_type}] ` + title, date, time, location }).eq('id', editingId);
                                if (err2) throw err2;
                            } else {
                                throw error;
                            }
                        }
                        addNotification('Partido Actualizado', 'Se han guardado los cambios del partido.', 'sports_soccer');
                        delete document.getElementById('form-soccer').dataset.editingId;
                    } else {
                        const { error } = await supabase.from('matches').insert([{ title, match_type, date, time, location }]);
                        if (error) {
                            if (error.message && error.message.includes("match_type")) {
                                // Fallback if match_type column does not exist yet
                                const { error: err2 } = await supabase.from('matches').insert([{ title: `[${match_type}] ` + title, date, time, location }]);
                                if (err2) throw err2;
                            } else {
                                throw error;
                            }
                        }
                        addNotification('Nuevo Partido', 'Se ha programado un nuevo encuentro.', 'sports_soccer');
                    }

                } else if (type === 'hangout') {
                    const title = document.getElementById('hj-title').value;
                    const date = document.getElementById('hj-date').value;
                    const time = document.getElementById('hj-time').value;
                    const food = document.getElementById('hj-food').value.split(',').map(f => f.trim());
                    const editingId = document.getElementById('form-hangout').dataset.editingId;

                    if (editingId) {
                        const { error } = await supabase.from('hangouts').update({ title, date, time, food_options: food }).eq('id', editingId);
                        if (error) throw error;
                        addNotification('Juntada Actualizada', 'Se han guardado los cambios de la juntada.', 'local_cafe');
                        delete document.getElementById('form-hangout').dataset.editingId;
                    } else {
                        const { error } = await supabase.from('hangouts').insert([{ title, date, time, food_options: food }]);
                        if (error) throw error;
                        addNotification('Nueva Juntada', 'Se armó una nueva salida, no te la pierdas.', 'local_cafe');
                    }

                } else if (type === 'birthday') {
                    const name = document.getElementById('bd-name').value;
                    const date = document.getElementById('bd-date').value;
                    const editingId = document.getElementById('form-birthday').dataset.editingId;

                    if (editingId) {
                        const { error } = await supabase.from('birthdays').update({ name, birth_date: date }).eq('id', editingId);
                        if (error) throw error;
                        addNotification('Cumpleaños Actualizado', 'Se han guardado los cambios del cumpleaños.', 'cake');
                        delete document.getElementById('form-birthday').dataset.editingId;
                    } else {
                        const { error } = await supabase.from('birthdays').insert([{ name, birth_date: date }]);
                        if (error) throw error;
                        addNotification('¡Felicidades!', `Es el cumpleaños de ${name}. ¡A celebrar!`, 'cake', true);
                    }
                }

                closeModal();
                // alert('¡Evento creado exitosamente en Supabase!'); // Opcional
                await fetchEvents(); // Actualizar el estado global

            } catch (error) {
                console.error("Error al crear evento:", error);
                alert("Error al guardar en base de datos: " + error.message);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }




        // ---- ANOTARSE A PARTIDO (MIGRADO A anotarseEnPosicion) ----
        if (!AppState.anotados) AppState.anotados = {};

        // ---- DESEAR CUMPLEAÑOS ----
        function desearCumpleanos(btn, nombre) {
            triggerConfetti();
            btn.innerHTML = '<span class="material-symbols-rounded text-[18px]">check_circle</span> ¡Enviado!';
            btn.disabled = true;
            btn.classList.remove('text-primary', 'border-primary', 'hover:bg-primary', 'hover:text-ink');
            btn.classList.add('bg-primary', 'text-ink', 'border-primary');
            addNotification('🎂 ¡Feliz Cumpleaños!', `Le deseaste feliz cumpleaños a ${nombre}.`, 'celebration', true);
        }

        // ---- MODAL DETALLES JUNTADA + CHAT ----
        function abrirDetallesJuntada(hangoutId) {
            const hangout = AppState.hangouts.find(h => h.id === hangoutId || h.title === hangoutId);
            if (!hangout) return;
            const id = hangout.id;

            if (!hangout.votes) hangout.votes = {};
            if (!hangout.votes._chat) hangout.votes._chat = [
                { user: 'Sofia', text: '¿Opciones veganas?', time: '20:15' },
                { user: 'Mateo', text: '¡Los tacos sirven!', time: '20:17' }
            ];
            const msgs = hangout.votes._chat;

            const overlay = document.getElementById('hangout-detail-overlay');
            const body = document.getElementById('hangout-detail-body');
            body.innerHTML = `
                <div class="p-6 border-b border-borderLight flex justify-between items-center bg-gray-50 rounded-t-[2rem]">
                    <div>
                        <h2 class="text-xl font-extrabold text-ink">${hangout.title}</h2>
                        <p class="text-sm text-textMuted mt-0.5">${hangout.date} · ${hangout.time}</p>
                    </div>
                    <button onclick="cerrarDetallesJuntada()" class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-textMuted transition-colors">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div class="p-6 flex flex-col gap-4 overflow-y-auto flex-grow">
                    <div class="flex flex-wrap gap-3 text-sm">
                        <span class="flex items-center gap-1.5 bg-primary/10 text-primaryDark font-semibold px-3 py-1.5 rounded-full">
                            <span class="material-symbols-rounded text-[15px]">restaurant</span> ${(hangout.food_options || []).join(', ') || 'Sin definir'}
                        </span>
                        <span class="flex items-center gap-1.5 bg-gray-100 text-ink font-semibold px-3 py-1.5 rounded-full">
                            <span class="material-symbols-rounded text-[15px]">event</span> ${hangout.date}
                        </span>
                        <span class="flex items-center gap-1.5 bg-gray-100 text-ink font-semibold px-3 py-1.5 rounded-full">
                            <span class="material-symbols-rounded text-[15px]">schedule</span> ${hangout.time}
                        </span>
                    </div>
                    <div class="border border-borderLight rounded-2xl flex flex-col overflow-hidden flex-grow" style="min-height:260px">
                        <div class="p-3 border-b border-borderLight bg-gray-50 flex items-center gap-2">
                            <span class="material-symbols-rounded text-primary text-[18px]">forum</span>
                            <span class="font-bold text-sm text-ink">Charla del grupo</span>
                        </div>
                        <div id="chat-messages-${id}" class="flex-grow overflow-y-auto p-4 flex flex-col gap-3" style="max-height:220px">
                            ${msgs.map(m => renderChatMsg(m)).join('')}
                        </div>
                        <div class="border-t border-borderLight p-3 flex gap-2">
                            <input id="chat-input-${id}" type="text" placeholder="Escribe un mensaje..."
                                class="flex-grow bg-gray-50 border border-borderLight rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                                onkeydown="if(event.key==='Enter') enviarMensajeChat('${id}')">
                            <button onclick="enviarMensajeChat('${id}')" class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-ink hover:bg-primaryDark transition-colors shrink-0">
                                <span class="material-symbols-rounded text-[18px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>`;
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => {
                overlay.querySelector('#hangout-detail-modal').classList.remove('opacity-0', 'scale-95');
                overlay.querySelector('#hangout-detail-modal').classList.add('opacity-100', 'scale-100');
            }, 10);
            // scroll al fondo del chat
            setTimeout(() => {
                const chatEl = document.getElementById(`chat-messages-${id}`);
                if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
            }, 50);
        }

        function renderChatMsg(m) {
            return `<div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-textMuted">${m.user} <span class="font-normal">${m.time}</span></span>
                <div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-ink w-fit max-w-[85%]">${m.text}</div>
            </div>`;
        }

        async function enviarMensajeChat(hangoutId) {
            const input = document.getElementById(`chat-input-${hangoutId}`);
            if (!input || !input.value.trim()) return;
            const text = input.value.trim();
            const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
            const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Yo';
            const now = new Date();
            const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            const hangout = AppState.hangouts.find(h => h.id === hangoutId);
            if (!hangout) return;
            if (!hangout.votes) hangout.votes = {};
            if (!hangout.votes._chat) hangout.votes._chat = [];

            const newMsg = { user: userName, text, time };
            hangout.votes._chat.push(newMsg);

            try {
                const { error } = await supabase.from('hangouts').update({ votes: hangout.votes }).eq('id', hangoutId);
                if (error) throw error;
            } catch (e) {
                console.error("Error saving chat message:", e);
            }

            const chatEl = document.getElementById(`chat-messages-${hangoutId}`);
            if (chatEl) {
                chatEl.insertAdjacentHTML('beforeend', renderChatMsg(newMsg));
                chatEl.scrollTop = chatEl.scrollHeight;
            }
            input.value = '';
        }

        function cerrarDetallesJuntada() {
            const overlay = document.getElementById('hangout-detail-overlay');
            const modal = overlay.querySelector('#hangout-detail-modal');
            modal.classList.remove('opacity-100', 'scale-100');
            modal.classList.add('opacity-0', 'scale-95');
            setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }, 300);
        }

        // Lógica de Revelado por Scroll
        function setupScrollReveal() {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach(el => observer.observe(el));
        }

        document.addEventListener("DOMContentLoaded", () => {
            setupScrollReveal();

            // Botones magnéticos
            document.querySelectorAll('.magnetic-btn').forEach(btn => {
                btn.addEventListener('mousemove', e => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });

            // Lógica Confeti
            const btnConfetti = document.getElementById('send-wishes-btn');
            const wrapper = document.getElementById('confetti-wrapper');
            const colors = ['#00c853', '#009624', '#ffffff', '#e2e8f0', '#0f172a'];

            if (btnConfetti) {
                btnConfetti.addEventListener('click', (e) => {
                    e.preventDefault();
                    triggerConfetti();
                    const originalText = btnConfetti.innerHTML;
                    btnConfetti.innerHTML = '<span class="material-symbols-rounded animate-bounce">check</span> ¡Enviado!';
                    btnConfetti.classList.add('bg-white', 'text-primary');
                    setTimeout(() => {
                        btnConfetti.innerHTML = originalText;
                        btnConfetti.classList.remove('bg-white', 'text-primary');
                    }, 2000);
                });
            }

            // Inicializar vista perfil avatares
            renderAvatarGrid();
        });

        function triggerConfetti() {
            const wrapper = document.getElementById('confetti-wrapper');
            const colors = ['#00c853', '#009624', '#ffffff', '#e2e8f0', '#0f172a'];
            for (let i = 0; i < 70; i++) {
                const particle = document.createElement('div');
                particle.classList.add('confetti-particle');
                const color = colors[Math.floor(Math.random() * colors.length)];
                const startX = Math.random() * 100 + 'vw';
                const duration = Math.random() * 2 + 2 + 's';
                particle.style.setProperty('--color', color);
                particle.style.setProperty('--start-x', startX);
                particle.style.setProperty('--rotation', Math.random() * 360 + 'deg');
                particle.style.setProperty('--duration', duration);
                particle.style.setProperty('--radius', Math.random() > 0.5 ? '50%' : '0');
                particle.style.width = Math.random() * 8 + 6 + 'px';
                particle.style.height = particle.style.width;
                wrapper.appendChild(particle);
                setTimeout(() => particle.remove(), parseFloat(duration) * 1000);
            }
        }

        // --- SISTEMA DE NOTIFICACIONES ---
        function closeNotifications() {
            const dropdown = document.getElementById('notif-dropdown');
            if (!dropdown || dropdown.classList.contains('hidden')) return;
            dropdown.classList.remove('opacity-100', 'scale-100');
            dropdown.classList.add('opacity-0', 'scale-95');
            setTimeout(() => dropdown.classList.add('hidden'), 300);
        }

        function toggleNotifications() {
            const dropdown = document.getElementById('notif-dropdown');
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
                setTimeout(() => {
                    dropdown.classList.remove('opacity-0', 'scale-95');
                    dropdown.classList.add('opacity-100', 'scale-100');
                }, 10);
                document.getElementById('notif-badge').classList.add('hidden'); // Marcar como leidas
            } else {
                closeNotifications();
            }
        }

        // Cerrar dropdown de notificaciones al clickear fuera
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('notif-dropdown');
            const notifBtn = e.target.closest('button[onclick="toggleNotifications()"]');
            const notifDropdown = e.target.closest('#notif-dropdown');
            if (!notifBtn && !notifDropdown && dropdown && !dropdown.classList.contains('hidden')) {
                closeNotifications();
            }
        }, { passive: true });

        function initSwipeToDelete(item) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            item.style.touchAction = 'pan-y';

            item.addEventListener('pointerdown', e => {
                startX = e.clientX;
                isDragging = true;
                item.style.transition = 'none';
                item.setPointerCapture(e.pointerId);
            });

            item.addEventListener('pointermove', e => {
                if (!isDragging) return;
                currentX = e.clientX - startX;
                if (Math.abs(currentX) > 10) {
                    item.style.transform = `translateX(${currentX}px)`;
                    item.style.opacity = 1 - (Math.abs(currentX) / 300);
                }
            });

            const endDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                if (Math.abs(currentX) > 80) {
                    item.style.transform = `translateX(${currentX > 0 ? 100 : -100}%)`;
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.remove();
                        const list = document.getElementById('notif-list');
                        if (list.children.length === 0) {
                            list.innerHTML = '<div class="p-4 text-center text-textMuted text-sm">No hay notificaciones nuevas</div>';
                            document.getElementById('notif-badge').classList.add('hidden');
                        }
                    }, 300);
                } else {
                    item.style.transform = 'translateX(0)';
                    item.style.opacity = '1';
                }
                currentX = 0;
            };

            item.addEventListener('pointerup', endDrag);
            item.addEventListener('pointercancel', endDrag);
        }

        function addNotification(title, message, icon, isBirthday = false) {
            const list = document.getElementById('notif-list');
            const badge = document.getElementById('notif-badge');

            // Eliminar placeholder si existe
            if (list.innerText.includes('No hay notificaciones')) {
                list.innerHTML = '';
            }

            const item = document.createElement('div');
            item.className = 'flex items-start gap-3 p-3 hover:bg-primary/5 rounded-2xl transition-colors cursor-grab animate-fade-in border-b border-borderLight last:border-0 relative select-none';
            item.innerHTML = `
                <div class="w-10 h-10 rounded-full ${isBirthday ? 'bg-pink-100 text-pink-600' : 'bg-primary/10 text-primary'} flex items-center justify-center shrink-0">
                    <span class="material-symbols-rounded">${icon}</span>
                </div>
                <div>
                    <h4 class="font-bold text-ink text-sm leading-tight pointer-events-none">${title}</h4>
                    <p class="text-xs text-textMuted mt-0.5 leading-snug pointer-events-none">${message}</p>
                </div>
            `;

            initSwipeToDelete(item);

            list.prepend(item);
            badge.classList.remove('hidden');

            if (isBirthday) {
                triggerConfetti();
            }
        }

        // --- ACTUALIZAR NÚMERO EN HEADER ---
        function updateHeaderJersey(number) {
            const el = document.getElementById('header-jersey-number');
            if (!el) return;
            if (number) {
                el.textContent = number;
                el.style.fontSize = number >= 10 ? '0.85rem' : '1.1rem';
                // Animar el cambio
                el.style.animation = 'none';
                void el.offsetWidth;
                el.style.animation = 'jerseyPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                // Agregar glow al botón
                const btn = document.getElementById('btn-tab-profile');
                if (btn) {
                    btn.style.borderColor = 'rgba(245,200,0,0.5)';
                    btn.style.boxShadow = '0 0 12px rgba(245,200,0,0.25)';
                }
            } else {
                el.textContent = '?';
            }
        }

        // --- RENDERIZAR GRID DE NÚMEROS DE CAMISETA ---
        function renderAvatarGrid() {
            renderJerseyGrid();
        }

        function renderJerseyGrid() {
            const container = document.getElementById('jersey-number-grid');
            if (!container) return;

            // Cargar número guardado en localStorage
            const saved = localStorage.getItem('userJerseyNumber');
            let html = '';
            for (let n = 1; n <= 99; n++) {
                const isSelected = saved && parseInt(saved) === n;
                html += `<div
                    onclick="selectJerseyNumber(this, ${n})"
                    data-number="${n}"
                    class="jersey-number-cell${isSelected ? ' jersey-selected' : ''}"
                    title="Número ${n}">
                    ${n}
                </div>`;
            }
            container.innerHTML = html;

            // Actualizar vista previa si hay un número guardado
            if (saved) {
                const sNum = parseInt(saved);
                updateJerseyPreview(sNum);
                
                // EASTER EGG INITIALIZATION
                if (sNum === 67) {
                    enable67Mode();
                } else {
                    disable67Mode();
                }
            }
        }

        function selectJerseyNumber(el, number) {
            // Quitar selección anterior
            document.querySelectorAll('.jersey-number-cell').forEach(c => {
                c.classList.remove('jersey-selected');
            });
            // Marcar el actual
            el.classList.add('jersey-selected');
            // Actualizar estado
            AppState.selectedJerseyNumber = number;
            updateJerseyPreview(number);
            // Habilitar botón guardar
            const btn = document.getElementById('btn-save-jersey');
            if (btn) btn.disabled = false;
        }

        function updateJerseyPreview(number) {
            const previewNum = document.getElementById('jersey-preview-number');
            const label = document.getElementById('jersey-selected-label');
            const preview = document.getElementById('jersey-preview');
            if (previewNum) {
                previewNum.textContent = number;
                previewNum.style.animation = 'none';
                void previewNum.offsetWidth; // reflow
                previewNum.style.animation = 'jerseyPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
            if (preview) {
                preview.classList.add('has-number');
            }
            if (label) {
                label.innerHTML = `<p class="text-base font-extrabold text-ink">Número <span style="color:#f5c800;font-family:'Bebas Neue',Impact,sans-serif;font-size:1.6rem;line-height:1">${number}</span></p><p class="text-xs text-textMuted mt-1">F5 Martes 14 15 ⚽</p>`;
            }
        }

        async function saveJerseyNumber() {
            const number = AppState.selectedJerseyNumber;
            if (!number) return;
            const btn = document.getElementById('btn-save-jersey');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-rounded animate-spin text-[18px]">progress_activity</span> Guardando...';
            btn.disabled = true;

            try {
                // Guardar en localStorage como fallback
                localStorage.setItem('userJerseyNumber', number);

                // Si hay Supabase, guardar en user_metadata
                if (supabase) {
                    const { error } = await supabase.auth.updateUser({
                        data: { jersey_number: number }
                    });
                    if (error) console.warn('No se pudo guardar en Supabase:', error.message);
                }

                btn.innerHTML = '<span class="material-symbols-rounded text-[18px]">check_circle</span> ¡Guardado!';
                btn.classList.add('bg-primary');
                // Actualizar header y AppState en tiempo real
                AppState.userJerseyNumber = number;
                updateHeaderJersey(number);
                addNotification('Camiseta actualizada', `¡Tu número es el ${number}! ⚽`, 'sports_soccer');
                
                // EASTER EGG: 67
                if (parseInt(number) === 67) {
                    setTimeout(() => {
                        addNotification('🥚 Easter Egg!', 'Modo 67 activado. La magia está en el aire.', 'star', true);
                        enable67Mode();
                    }, 1000);
                } else {
                    disable67Mode();
                }

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-primary');
                    btn.disabled = false;
                }, 2000);
            } catch (e) {
                alert('Error al guardar: ' + e.message);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }

        /* ============================================================
           🏟️ EL MANTO SAGRADO — Funciones JS
           ============================================================ */

        let jerseyIsFlipped = false;

        function toggleJerseyFlip() {
            jerseyIsFlipped = !jerseyIsFlipped;
            const card = document.getElementById('manto-card');
            if (!card) return;
            if (jerseyIsFlipped) {
                card.classList.add('flipped');
                document.getElementById('manto-btn-front')?.classList.remove('active');
                document.getElementById('manto-btn-back')?.classList.add('active');
            } else {
                card.classList.remove('flipped');
                document.getElementById('manto-btn-front')?.classList.add('active');
                document.getElementById('manto-btn-back')?.classList.remove('active');
            }
        }

        function showJerseyFront() {
            jerseyIsFlipped = false;
            const card = document.getElementById('manto-card');
            if (card) card.classList.remove('flipped');
            document.getElementById('manto-btn-front')?.classList.add('active');
            document.getElementById('manto-btn-back')?.classList.remove('active');
        }

        function showJerseyBack() {
            jerseyIsFlipped = true;
            const card = document.getElementById('manto-card');
            if (card) card.classList.add('flipped');
            document.getElementById('manto-btn-front')?.classList.remove('active');
            document.getElementById('manto-btn-back')?.classList.add('active');
        }

        function updateMantoData() {
            // Número
            const num = AppState.userJerseyNumber || localStorage.getItem('userJerseyNumber');
            const numEl = document.getElementById('manto-number');
            const infoEl = document.getElementById('manto-info-number');
            if (numEl) {
                numEl.textContent = num || '?';
                // Ajustar tamaño si el número tiene 2 dígitos
                numEl.style.fontSize = num && parseInt(num) >= 10 ? '6rem' : '8rem';
            }
            if (infoEl) {
                infoEl.textContent = num ? '#' + num : '—';
                infoEl.style.color = num ? '#f5c800' : 'inherit';
                infoEl.style.fontFamily = num ? "'Bebas Neue', Impact, sans-serif" : 'inherit';
            }
            // Nombre del jugador
            const nameEl = document.getElementById('manto-playername');
            if (nameEl && AppState.currentUser) {
                nameEl.textContent = AppState.currentUser.toUpperCase();
                // Ajustar tamaño del nombre si es largo
                const len = AppState.currentUser.length;
                nameEl.style.fontSize = len > 8 ? '1.1rem' : len > 5 ? '1.4rem' : '1.6rem';
            }
        }

        /* ============================================================
           ✨ ANIMACIONES PREMIUM AVANZADAS
           Todo usa transform/opacity y requestAnimationFrame — 60fps
           ============================================================ */

        /* ---- 1. CANVAS DE PARTÍCULAS FLOTANTES ---- */
        (function initParticles() {
            const canvas = document.getElementById('particle-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            let animId;

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize, { passive: true });

            function createParticle() {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    alpha: Math.random() * 0.4 + 0.1,
                    color: Math.random() > 0.5 ? '0,200,83' : '100,150,255'
                };
            }

            for (let i = 0; i < 60; i++) particles.push(createParticle());

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                    ctx.fill();
                });
                // Líneas de conexión entre partículas cercanas
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(0, 200, 83, ${0.08 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
                animId = requestAnimationFrame(draw);
            }
            draw();
        })();

        /* ---- 2. EFECTO SPOTLIGHT DEL CURSOR EN CARDS ---- */
        (function initSpotlight() {
            document.addEventListener('mousemove', e => {
                document.querySelectorAll('.glass-card, .tilt-card').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--spotlight-x', `${x} px`);
                    card.style.setProperty('--spotlight-y', `${y} px`);
                });
            }, { passive: true });
        })();

        /* ---- 3. TYPEWRITER EN EL TÍTULO HERO ---- */
        (function initTypewriter() {
            const target = document.querySelector('#view-home h1');
            if (!target) return;
            const line1 = 'Bienvenidos,';
            const line2 = 'F5 Martes de 14 a 15';
            target.innerHTML = '';
            let i = 0;
            let phase = 1; // 1=line1, 2=line2
            const cursor = document.createElement('span');
            cursor.className = 'inline-block w-0.5 h-[0.9em] bg-primary ml-1 align-middle animate-pulse';
            target.appendChild(cursor);

            function type() {
                if (phase === 1) {
                    if (i <= line1.length) {
                        target.innerHTML = '';
                        const t = document.createTextNode(line1.slice(0, i));
                        target.appendChild(t);
                        target.appendChild(cursor);
                        i++;
                        setTimeout(type, 60);
                    } else {
                        target.innerHTML = line1 + '<br>';
                        const span = document.createElement('span');
                        span.className = 'text-primary neon-green';
                        target.appendChild(span);
                        target.appendChild(cursor);
                        phase = 2;
                        i = 0;
                        setTimeout(type, 200);
                    }
                } else {
                    const span = target.querySelector('span.text-primary');
                    if (!span) return;
                    if (i <= line2.length) {
                        span.textContent = line2.slice(0, i);
                        i++;
                        setTimeout(type, 70);
                    } else {
                        // Quitar cursor al terminar
                        setTimeout(() => cursor.remove(), 1000);
                    }
                }
            }
            // Esperar a que el DOM esté listo y la vista cargue
            setTimeout(type, 600);
        })();

        /* ---- 4. SMOOTH NUMBER COUNTER ---- */
        function animateCounter(el, target, duration = 1000) {
            if (!el) return;
            const start = parseInt(el.textContent) || 0;
            const startTime = performance.now();
            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                el.textContent = Math.round(start + (target - start) * eased);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
        // Sobrescribir updateSidebarStats para usar el counter animado
        function updateSidebarStats(matchesCount, hangoutsCount) {
            const mEl = document.getElementById('sidebar-stat-matches');
            const hEl = document.getElementById('sidebar-stat-hangouts');
            if (mEl) animateCounter(mEl, matchesCount);
            if (hEl) animateCounter(hEl, hangoutsCount);
        }

        /* ---- 5. ANIMATED GRADIENT BORDER EN HERO CARD ---- */
        (function initRotatingBorder() {
            const style = document.createElement('style');
            style.textContent = `
                /* rotating-border deshabilitada por petición del usuario (movimiento verde)
                @keyframes rotateBorder {
                    from { --angle: 0deg; }
                    to   { --angle: 360deg; }
                }
                @property --angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                }
                .rotating-border {
                    border: 2px solid transparent;
                    background-clip: padding-box;
                    position: relative;
                }
                .rotating-border::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: inherit;
                    background: conic-gradient(from var(--angle), transparent 70%, #00c853 80%, #69f0ae 90%, transparent 100%);
                    animation: rotateBorder 3s linear infinite;
                    z-index: -1;
                }
                */
                /* Spotlight CSS var */
                .glass-card, .tilt-card {
                    background-image: radial-gradient(
                        circle 200px at var(--spotlight-x, -999px) var(--spotlight-y, -999px),
                        rgba(0,200,83,0.06),
                        transparent 100%
                    );
                }
                /* Cursor magnético más pronunciado */
                .magnetic-btn:hover {
                    animation: magneticPulse 1.5s ease-in-out infinite;
                }
                @keyframes magneticPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,200,83,0.4); }
                    50%       { box-shadow: 0 0 0 12px rgba(0,200,83,0); }
                }
                /* Línea de luz animada en la sección hero */
                .hero-light-sweep::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 60%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
                    animation: heroSweep 4s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes heroSweep {
                    0%   { left: -100%; }
                    50%  { left: 150%; }
                    100% { left: 150%; }
                }
                /* Texto hero con gradiente animado */
                .gradient-text-anim {
                    background: linear-gradient(90deg, #00c853, #69f0ae, #00e676, #00c853);
                    background-size: 300% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: textGradientMove 4s linear infinite;
                }
                @keyframes textGradientMove {
                    0%   { background-position: 0% center; }
                    100% { background-position: 300% center; }
                }
                /* Sidebar nav item: line growing from left */
                .nav-item {
                    overflow: hidden;
                }
                .nav-item::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0;
                    width: 3px; height: 100%;
                    background: #00c853;
                    border-radius: 0 4px 4px 0;
                    transform: scaleY(0);
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    transform-origin: bottom;
                }
                .nav-item.active::before,
                .nav-item:hover::before {
                    transform: scaleY(1);
                    transform-origin: top;
                }
            `;
            document.head.appendChild(style);
            // [Guardado por si hay que volver atrás]
            // const heroCard = document.querySelector('#home-content > div:first-child');
            // if (heroCard) heroCard.classList.add('rotating-border');
            // Aplicar hero-light-sweep al hero banner
            const heroBanner = document.querySelector('#view-home section:first-child > div');
            if (heroBanner) heroBanner.classList.add('hero-light-sweep');

            // Aplicar gradient-text-anim al neon verde del hero
            // Se aplica al span cuando ya fue renderizado por typewriter
            setTimeout(() => {
                const neon = document.querySelector('#view-home h1 .text-primary');
                if (neon) neon.classList.add('gradient-text-anim');
            }, 3000);
        })();

        /* ---- 6. MICRO-INTERACCIÓN: PRESS FEEDBACK EN BOTONES ---- */
        document.addEventListener('pointerdown', e => {
            const btn = e.target.closest('button, .magnetic-btn');
            if (!btn) return;
            btn.style.transition = 'transform 0.1s ease';
            btn.style.transform = 'scale(0.96)';
            const up = () => {
                btn.style.transform = '';
                btn.style.transition = '';
                document.removeEventListener('pointerup', up);
            };
            document.addEventListener('pointerup', up);
        }, { passive: true });

        const courtsData = {
            'F5': [
                { name: 'Move F5', address: '32 Entre 1 y 2', wa: '+54 9 221 683-5053' },
                { name: 'La Canchita', address: '7 Entre 32 Y 33', wa: '+54 9 221 440-3142' },
                { name: 'Adriatico "La Fortaleza"', address: '32 Entre 7 y 8', wa: '+54 9 221 534-0497' },
                { name: 'Siempre Al Diez', address: '24 Entre 34 y 35', wa: '+54 9 221 638-3701' },
                { name: 'Bahía 37', address: '37 Entre 9 y 10', wa: '+54 9 221 562-6136' },
                { name: 'Predio Norte', address: '41 Entre 7 y 8', wa: '+54 9 221 595-7475' },
                { name: 'Versus', address: '2 entre 41 y 42', wa: '+54 9 221 576-1642' },
                { name: 'El Deportivo', address: '41 entre 1 y 2', wa: '+54 9 221 420-7342' },
                { name: 'El Calcio', address: '3 Entre 42 y 43', wa: '+54 9 221 481-7976' },
                { name: 'Estadio 55', address: '55 Entre Diagonal 73 11 y 12', wa: '+54 9 221 537-3600' },
                { name: 'Estadio 7', address: '6 entre 58 y 59', wa: '+54 9 221 434-3655' },
                { name: 'Mega Estadio', address: '1 Entre 61 y 62', wa: '+54 9 221 506-1161' },
                { name: 'Complejo 62', address: '62 Entre 115 y 1', wa: '+54 9 221 506-1161' },
                { name: 'Garra Charrua', address: '64 Entre 7 y 8', wa: '+54 9 221 305-0990' },
                { name: 'Eskuernaga', address: '120 Entre 64 y 65', wa: '+54 9 221 558-3123' },
                { name: 'La Cueva Del Oso', address: '64 Entre 25 y 26', wa: '+54 9 221 554-6016' },
                { name: 'El Templo', address: '65 Entre 120 y 121', wa: '+54 9 221 411-4783' },
                { name: 'Tuto Fútbol 5', address: '66 Entre 117 y 118', wa: '+54 9 221 488-3034' },
                { name: 'Camp Nou', address: '69 entre 12 y 13', wa: '+54 9 221 360-6778' },
                { name: 'Complejo La Villa', address: '120 Entre 68 y 69', wa: '+54 9 221 319-8190' },
                { name: 'Segurola Y Habana', address: '11 Entre 70 y 71', wa: '+54 9 221 495-8009' },
                { name: 'La Rambla', address: '74 Entre 118 y 119', wa: '+54 9 221 591-5966' },
                { name: 'Napoles Complejo Deportivo', address: '80 Entre 117 y 118', wa: '+54 9 221 452-4977' }
            ],
            'F7': [
                { name: 'Las Palmas Fútbol 7', address: '22 Entre 37 y 38', wa: '+54 9 221 534-2116' },
                { name: 'Las Palmas Fútbol 7 ', address: '27 Entre 41 y 42', wa: '+54 9 221 523-8269' }
            ],
            'F11': [
                { name: 'La pulguita', address: '518 133 y 134', wa: '+54 9 221 615-2534' },
                { name: 'Al Aire Libre', address: '137 74 y 75', wa: '+54 9 221 463-3149' },
                { name: 'Predio 98', address: '98 y 16', wa: '+54 9 221 625-8869' }
            ]
        };

        function renderCourtsList() {
            const type = document.getElementById('f5-type').value;
            const container = document.getElementById('courts-container');
            const list = document.getElementById('courts-list');
            
            if (courtsData[type] && courtsData[type].length > 0) {
                container.classList.remove('hidden');
                list.innerHTML = courtsData[type].map(court => {
                    const waNumber = court.wa.replace(/\D/g, ''); 
                    const waLink = `https://wa.me/${waNumber}?text=Hola,%20quer%C3%ADa%20averiguar%20turnos%20disponibles%20para%20f%C3%BAtbol%20${type.replace('F','')}`;
                    return `
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-borderLight bg-white hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group gap-3 sm:gap-0" onclick="document.getElementById('f5-location').value = '${court.name}'">
                            <div class="flex flex-col flex-1 min-w-0 pr-3">
                                <span class="font-extrabold text-sm text-ink group-hover:text-primary transition-colors truncate" title="Seleccionar ${court.name}">${court.name}</span>
                                <span class="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1 truncate"><span class="material-symbols-rounded text-[14px]">location_on</span> ${court.address}</span>
                                <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate"><span class="material-symbols-rounded text-[13px]">call</span> ${court.wa}</span>
                            </div>
                            <a href="${waLink}" target="_blank" onclick="event.stopPropagation()" class="w-full sm:w-auto px-4 py-2 sm:p-0 sm:w-10 sm:h-10 rounded-xl sm:rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shrink-0 border border-[#25D366]/20 shadow-sm gap-2 sm:gap-0" title="Contactar por WhatsApp">
                                <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                <span class="sm:hidden font-bold text-sm">Consultar Turno</span>
                            </a>
                        </div>
                    `;
                }).join('');
            } else {
                container.classList.add('hidden');
            }
        }

        // Initialize and bind
        document.getElementById('f5-type').addEventListener('change', renderCourtsList);
        // Also call on showForm for soccer
        const origShowForm = window.showForm;
        window.showForm = function(type) {
            origShowForm(type);
            if (type === 'soccer') renderCourtsList();
        }

        // --- EASTER EGGS ---
        // Konami Code -> GOOOOOOL!
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        // Word Codes
        const wordCodes = {
            messi: ['m','e','s','s','i'],
            diego: ['d','i','e','g','o'],
            f5: ['f','5']
        };
        let wordProgress = { messi: 0, diego: 0, f5: 0 };

        document.addEventListener('keydown', function(e) {
            // Ignore if typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Konami
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    triggerGoalEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }

            // Words
            const key = e.key.toLowerCase();
            for (let code in wordCodes) {
                if (key === wordCodes[code][wordProgress[code]]) {
                    wordProgress[code]++;
                    if (wordProgress[code] === wordCodes[code].length) {
                        triggerWordEasterEgg(code);
                        wordProgress[code] = 0;
                    }
                } else {
                    wordProgress[code] = (key === wordCodes[code][0]) ? 1 : 0;
                }
            }
        });

        function triggerGoalEasterEgg() {
            const div = document.createElement('div');
            div.className = 'fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden bg-black/40 backdrop-blur-sm transition-all duration-500 opacity-0';
            div.innerHTML = `<div class="text-[100px] md:text-[200px] font-extrabold text-[#f5c800] uppercase animate-bounce drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transform -rotate-12 select-none" style="font-family:'Impact',sans-serif; -webkit-text-stroke: 4px white;">¡GOOOOOOL!</div>`;
            document.body.appendChild(div);
            
            setTimeout(() => div.classList.replace('opacity-0', 'opacity-100'), 50);
            
            let times = 0;
            let interval = setInterval(() => {
                if(typeof triggerConfetti === 'function') triggerConfetti();
                times++;
                if(times >= 5) clearInterval(interval);
            }, 500);

            setTimeout(() => {
                div.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() => div.remove(), 500);
            }, 3500);
        }

        function triggerWordEasterEgg(type) {
            if (type === 'f5') {
                document.body.style.transition = "transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
                document.body.style.transform = "rotate(360deg)";
                addNotification('¡F5!', 'Recargando el equipo...', 'refresh', true);
                setTimeout(() => {
                    document.body.style.transition = "none";
                    document.body.style.transform = "rotate(0deg)";
                }, 1500);
                return;
            }
            
            const div = document.createElement('div');
            div.className = 'fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden bg-black/70 backdrop-blur-md transition-all duration-500 opacity-0';
            
            let text = "";
            let strokeColor = "#00a4e4";
            if (type === 'messi') {
                text = "¡CAMPEONES<br>DEL MUNDO!<br>⭐⭐⭐";
            } else if (type === 'diego') {
                text = "¡BARRILETE<br>CÓSMICO!";
                strokeColor = "#ffffff";
            }
            
            div.innerHTML = `<div class="text-[60px] md:text-[120px] text-center font-extrabold text-white uppercase drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transform scale-50 transition-transform duration-700 ease-out" style="font-family:'Impact',sans-serif; -webkit-text-stroke: 3px ${strokeColor}; line-height: 1.1;">${text}</div>`;
            document.body.appendChild(div);
            
            setTimeout(() => {
                div.classList.replace('opacity-0', 'opacity-100');
                div.querySelector('div').classList.replace('scale-50', 'scale-100');
            }, 50);
            
            let times = 0;
            let interval = setInterval(() => {
                if(typeof triggerConfetti === 'function') triggerConfetti();
                times++;
                if(times >= 5) clearInterval(interval);
            }, 500);

            setTimeout(() => {
                div.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() => div.remove(), 500);
            }, 4000);
        }

        function triggerBoboEasterEgg() {
            const div = document.createElement('div');
            div.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-500 opacity-0';
            div.innerHTML = `<div class="flex flex-col items-center justify-center transform scale-50 transition-transform duration-700 ease-out">
                <img src="https://media.tenor.com/tYtKnd9u9XgAAAAC/messi-bobo.gif" class="rounded-3xl shadow-[0_0_50px_rgba(0,164,228,0.5)] border-4 border-[#00a4e4] max-w-[80vw] md:max-w-md" alt="Anda pa alla bobo">
                <div class="text-4xl md:text-6xl text-center font-extrabold text-white uppercase mt-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" style="font-family:'Impact',sans-serif; -webkit-text-stroke: 2px #00a4e4; line-height:1.1;">¿QUÉ MIRÁS BOBO?<br>ANDÁ PA' ALLÁ</div>
            </div>`;
            document.body.appendChild(div);
            
            setTimeout(() => {
                div.classList.replace('opacity-0', 'opacity-100');
                div.querySelector('div').classList.replace('scale-50', 'scale-100');
            }, 50);

            setTimeout(() => {
                div.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() => div.remove(), 500);
            }, 4000);
        }

        function enable67Mode() {
            if (document.getElementById('easter-egg-67-overlay')) return;
            const div = document.createElement('div');
            div.id = 'easter-egg-67-overlay';
            div.className = 'fixed inset-0 pointer-events-none z-[9998]';
            div.style.backgroundImage = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48dGV4dCB4PSI3NSIgeT0iNzUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmaWxsPSJyZ2JhKDI0NSwyMDAsMCwwLjE1KSIgdHJhbnNmb3JtPSJyb3RhdGUoLTMwIDc1IDc1KSI+Njc8L3RleHQ+PC9zdmc+')`;
            div.style.backgroundRepeat = 'repeat';
            div.style.animation = 'slideBg 15s linear infinite';
            document.body.appendChild(div);
        }

        function disable67Mode() {
            const div = document.getElementById('easter-egg-67-overlay');
            if (div) div.remove();
        }
    
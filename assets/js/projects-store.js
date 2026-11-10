/**
 * Client-side dynamic project store (no database required).
 * Persists projects in localStorage seeded from the initial portfolio works.
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'ahil_portfolio_projects_v1';
    const CHANNEL_NAME = 'ahil_portfolio_projects_channel';

    const CATEGORIES = {
        wordpress: {
            id: 'wordpress',
            label: 'Wordpress Websites',
            metaLabel: 'WordPress',
            listId: 'wordpressProjectList',
            searchInputId: 'projectSearchInput',
            colClass: 'project-list-col'
        },
        ecommerce: {
            id: 'ecommerce',
            label: 'E-commerce',
            metaLabel: 'eCommerce',
            listId: 'ecommerceProjectList',
            searchInputId: 'ecommerceSearchInput',
            colClass: 'ecommerce-list-col'
        },
        landing: {
            id: 'landing',
            label: 'Landing Page',
            metaLabel: 'Landing Page',
            listId: 'landingProjectList',
            searchInputId: 'landingSearchInput',
            colClass: 'landing-list-col'
        },
        dashboard: {
            id: 'dashboard',
            label: 'Dashboard UI',
            metaLabel: 'Dashboard UI',
            listId: 'dashboardProjectList',
            searchInputId: 'dashboardSearchInput',
            colClass: 'dashboard-list-col'
        }
    };

    const DEFAULT_PROJECTS = [
        // WordPress Websites
        { id: 'wp-1', category: 'wordpress', name: 'Sai Cocopeat', url: 'https://saicocopeat.com/', domain: 'saicocopeat.com' },
        { id: 'wp-2', category: 'wordpress', name: 'F3', url: 'https://firstframefourm.com/', domain: 'firstframefourm.com' },
        { id: 'wp-3', category: 'wordpress', name: 'Bricks and woods', url: 'https://bricksandwoods.com/', domain: 'bricksandwoods.com' },
        { id: 'wp-4', category: 'wordpress', name: 'Pentagon', url: 'https://pentagonms.com/', domain: 'pentagonms.com' },
        { id: 'wp-5', category: 'wordpress', name: 'Vine Infotech', url: 'https://vineinfotech.com/', domain: 'vineinfotech.com' },
        { id: 'wp-6', category: 'wordpress', name: 'Lifttech Landing Page', url: 'https://campaign.lifttechequipments.com/', domain: 'campaign.lifttechequipments.com' },
        { id: 'wp-7', category: 'wordpress', name: 'Bellfabs Boilers', url: 'https://bellfabsindia.com/', domain: 'bellfabsindia.com' },
        { id: 'wp-8', category: 'wordpress', name: 'IT-World', url: 'https://it-world.in/', domain: 'it-world.in' },
        { id: 'wp-9', category: 'wordpress', name: 'Ashwini', url: 'https://ashwinidigitalsolution.com/', domain: 'ashwinidigitalsolution.com' },
        { id: 'wp-10', category: 'wordpress', name: 'TVS', url: 'https://tvs.in/', domain: 'tvs.in' },
        { id: 'wp-11', category: 'wordpress', name: 'SG Promoters', url: 'https://sgpromoters.in/', domain: 'sgpromoters.in' },
        { id: 'wp-12', category: 'wordpress', name: 'Kids Nation', url: 'https://kidsnationpreschool.com/', domain: 'kidsnationpreschool.com' },
        { id: 'wp-13', category: 'wordpress', name: 'CES', url: 'https://www.core-energys.com/', domain: 'core-energys.com' },
        { id: 'wp-14', category: 'wordpress', name: 'Vetri MEP', url: 'https://vetrimep.com/', domain: 'vetrimep.com' },
        { id: 'wp-15', category: 'wordpress', name: 'Rigen', url: 'https://rigenacademy.com/', domain: 'rigenacademy.com' },
        { id: 'wp-16', category: 'wordpress', name: 'Maznica', url: 'https://maznica.com/', domain: 'maznica.com' },
        { id: 'wp-17', category: 'wordpress', name: 'JK Interiors', url: 'https://jkinteriorandexterior.in/', domain: 'jkinteriorandexterior.in' },
        { id: 'wp-18', category: 'wordpress', name: 'Apex', url: 'https://apex-electricals.in/', domain: 'apex-electricals.in' },
        { id: 'wp-19', category: 'wordpress', name: 'IWEU', url: 'https://iweuapp.com/', domain: 'iweuapp.com' },
        { id: 'wp-20', category: 'wordpress', name: 'Sri Durga', url: 'https://sridurgatmt.com/', domain: 'sridurgatmt.com' },
        { id: 'wp-21', category: 'wordpress', name: 'Learnxel', url: 'https://learnxel.com/', domain: 'learnxel.com' },
        { id: 'wp-22', category: 'wordpress', name: 'Andal associates', url: 'https://aapltd.in/', domain: 'aapltd.in' },
        { id: 'wp-23', category: 'wordpress', name: 'GCON', url: 'https://gconengineers.com/', domain: 'gconengineers.com' },
        { id: 'wp-24', category: 'wordpress', name: 'GMG', url: 'https://grandbuilders.in/', domain: 'grandbuilders.in' },
        { id: 'wp-25', category: 'wordpress', name: 'Ayatco', url: 'https://ayatco-international.com/', domain: 'ayatco-international.com' },
        { id: 'wp-26', category: 'wordpress', name: 'Niyata', url: 'https://niyatainfotech.com/', domain: 'niyatainfotech.com' },
        { id: 'wp-27', category: 'wordpress', name: 'EMR', url: 'https://emr.global/', domain: 'emr.global' },
        { id: 'wp-28', category: 'wordpress', name: 'CES', url: 'https://www.core-energys.com/', domain: 'core-energys.com' },

        // E-commerce
        { id: 'ec-1', category: 'ecommerce', name: 'Timelux', url: 'https://timelux.in/', domain: 'timelux.in' },
        { id: 'ec-2', category: 'ecommerce', name: 'Lilara', url: 'https://lilara.in/', domain: 'lilara.in' },
        { id: 'ec-3', category: 'ecommerce', name: 'Palagai', url: 'https://demo.digitaltechalpha.com/', domain: 'demo.digitaltechalpha.com' },
        { id: 'ec-4', category: 'ecommerce', name: 'Eatups', url: 'https://eatupsindia.com/', domain: 'eatupsindia.com' },
        { id: 'ec-5', category: 'ecommerce', name: 'Biorithin', url: 'https://bioritin.com/', domain: 'bioritin.com' },

        // Landing Page
        { id: 'lp-1', category: 'landing', name: 'BNA', url: 'https://businessnetworkapp.com/', domain: 'businessnetworkapp.com' },
        { id: 'lp-2', category: 'landing', name: 'BSS', url: 'https://bestsecurity.co/lp/securityservices/', domain: 'bestsecurity.co' },
        { id: 'lp-3', category: 'landing', name: 'Koka', url: 'https://campaign.innoblitz.in/koka/', domain: 'campaign.innoblitz.in' },
        { id: 'lp-4', category: 'landing', name: 'Liftech', url: 'https://lifttechequipments.innoblitz.in/', domain: 'lifttechequipments.innoblitz.in' },

        // Dashboard UI
        { id: 'db-1', category: 'dashboard', name: 'Pyxis', url: 'https://ui.innoblitz.in/pyxis_v2/index.html', domain: 'ui.innoblitz.in/pyxis_v2' },
        { id: 'db-2', category: 'dashboard', name: 'Rotary', url: 'https://ui.innoblitz.in/rotary/#', domain: 'ui.innoblitz.in/rotary' }
    ];

    let broadcastChannel = null;
    try {
        if ('BroadcastChannel' in global) {
            broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
        }
    } catch (_) {
        broadcastChannel = null;
    }

    function cloneDefaults() {
        return DEFAULT_PROJECTS.map(function (item) {
            return Object.assign({}, item);
        });
    }

    function normalizeUrl(rawUrl) {
        const trimmed = String(rawUrl || '').trim();
        if (!trimmed) {
            throw new Error('Project URL is required.');
        }
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
        let parsed;
        try {
            parsed = new URL(withProtocol);
        } catch (_) {
            throw new Error('Please enter a valid URL.');
        }
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('Only http and https URLs are supported.');
        }
        return parsed.href;
    }

    function extractDomainLabel(url) {
        try {
            const parsed = new URL(normalizeUrl(url));
            return parsed.hostname.replace(/^www\./i, '');
        } catch (_) {
            return String(url || '').trim();
        }
    }

    function sanitizeProject(raw, index) {
        if (!raw || typeof raw !== 'object') return null;
        const category = CATEGORIES[raw.category] ? raw.category : null;
        const name = String(raw.name || '').trim();
        if (!category || !name) return null;

        let safeUrl;
        try {
            safeUrl = normalizeUrl(raw.url);
        } catch (_) {
            return null;
        }

        const domain = String(raw.domain || '').trim() || extractDomainLabel(safeUrl);
        const id = String(raw.id || '').trim() || ('proj-' + Date.now() + '-' + (index || 0));

        return {
            id: id,
            category: category,
            name: name,
            url: safeUrl,
            domain: domain
        };
    }

    function readStorage() {
        try {
            const raw = global.localStorage.getItem(STORAGE_KEY);
            if (raw === null) {
                const seeded = cloneDefaults();
                global.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
                return seeded;
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return cloneDefaults();
            }
            return parsed
                .map(function (item, i) { return sanitizeProject(item, i); })
                .filter(Boolean);
        } catch (_) {
            return cloneDefaults();
        }
    }

    function writeStorage(projects) {
        try {
            global.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (err) {
            throw new Error('Unable to save projects to browser storage: ' + err.message);
        }
        if (broadcastChannel) {
            try {
                broadcastChannel.postMessage({ type: 'projects-updated', timestamp: Date.now() });
            } catch (_) {
                // Ignore broadcast errors
            }
        }
    }

    function getAll() {
        return readStorage();
    }

    function getByCategory(category) {
        if (!CATEGORIES[category]) return [];
        return readStorage().filter(function (project) {
            return project.category === category;
        });
    }

    function addProject(input) {
        const name = String(input && input.name || '').trim();
        const category = input && input.category;
        if (!name) {
            throw new Error('Project name is required.');
        }
        if (!CATEGORIES[category]) {
            throw new Error('Please select a valid category.');
        }

        const safeUrl = normalizeUrl(input.url);
        const domain = String(input && input.domain || '').trim() || extractDomainLabel(safeUrl);

        const newProject = {
            id: 'proj-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            category: category,
            name: name,
            url: safeUrl,
            domain: domain
        };

        const projects = readStorage();
        projects.push(newProject);
        writeStorage(projects);
        return newProject;
    }

    function updateProject(id, updates) {
        const projects = readStorage();
        const idx = projects.findIndex(function (p) { return p.id === id; });
        if (idx === -1) {
            throw new Error('Project not found.');
        }

        const current = projects[idx];
        const nextCategory = updates.category !== undefined ? updates.category : current.category;
        const nextName = String(updates.name !== undefined ? updates.name : current.name).trim();
        if (!nextName) {
            throw new Error('Project name is required.');
        }
        if (!CATEGORIES[nextCategory]) {
            throw new Error('Please select a valid category.');
        }

        const safeUrl = normalizeUrl(updates.url !== undefined ? updates.url : current.url);
        const rawDomain = updates.domain !== undefined ? String(updates.domain).trim() : current.domain;
        const nextDomain = rawDomain || extractDomainLabel(safeUrl);

        const updated = {
            id: current.id,
            category: nextCategory,
            name: nextName,
            url: safeUrl,
            domain: nextDomain
        };

        projects[idx] = updated;
        writeStorage(projects);
        return updated;
    }

    function deleteProject(id) {
        const projects = readStorage();
        const filtered = projects.filter(function (p) { return p.id !== id; });
        if (filtered.length === projects.length) {
            return false;
        }
        writeStorage(filtered);
        return true;
    }

    function resetDefaults() {
        const seeded = cloneDefaults();
        writeStorage(seeded);
        return seeded;
    }

    function importProjects(list) {
        if (!Array.isArray(list)) {
            throw new Error('Invalid project data: expected an array.');
        }
        const cleaned = list
            .map(function (item, i) { return sanitizeProject(item, i); })
            .filter(Boolean);
        writeStorage(cleaned);
        return cleaned;
    }

    function subscribe(callback) {
        if (typeof callback !== 'function') return function () { };

        const onStorage = function (event) {
            if (event.key === STORAGE_KEY) {
                callback(readStorage());
            }
        };
        global.addEventListener('storage', onStorage);

        const onMessage = function (event) {
            if (event && event.data && event.data.type === 'projects-updated') {
                callback(readStorage());
            }
        };
        if (broadcastChannel) {
            broadcastChannel.addEventListener('message', onMessage);
        }

        return function unsubscribe() {
            global.removeEventListener('storage', onStorage);
            if (broadcastChannel) {
                broadcastChannel.removeEventListener('message', onMessage);
            }
        };
    }

    global.ProjectsStore = {
        STORAGE_KEY: STORAGE_KEY,
        CATEGORIES: CATEGORIES,
        DEFAULT_PROJECTS: DEFAULT_PROJECTS,
        getAll: getAll,
        getByCategory: getByCategory,
        addProject: addProject,
        updateProject: updateProject,
        deleteProject: deleteProject,
        resetDefaults: resetDefaults,
        importProjects: importProjects,
        extractDomainLabel: extractDomainLabel,
        normalizeUrl: normalizeUrl,
        subscribe: subscribe
    };
})(window);

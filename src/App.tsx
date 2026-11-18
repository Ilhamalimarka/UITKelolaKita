import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Role = "user" | "admin";
type TxType = "income" | "expense";
type Page =
  | "dashboard"
  | "income"
  | "expense"
  | "report"
  | "profile"
  | "recommendation"
  | "users"
  | "categories";

type Profile = {
  profession: string;
  monthlyIncome: number;
  incomeCategory: string;
  dependents: number;
  educationCost: number;
  installmentCost: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  profile: Profile;
};

type Transaction = {
  id: string;
  userId: string;
  type: TxType;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
};

type Category = { id: string; name: string; type: TxType };
type Store = { users: User[]; transactions: Transaction[]; categories: Category[] };

const STORAGE_KEY = "kelolakita-keuangan-keluarga-v3";
const SESSION_KEY = "keluarga-finansial-session";

const localDate = (value: Date) => {
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 10);
};
const today = localDate(new Date());
const monthStart = `${today.slice(0, 7)}-01`;

const emptyProfile: Profile = {
  profession: "",
  monthlyIncome: 0,
  incomeCategory: "",
  dependents: 0,
  educationCost: 0,
  installmentCost: 0,
};

// Daftar akun awal. Ganti nama, email, dan kata sandi sesuai daftar keluarga.
const initialStore: Store = {
  users: [
    {
      id: "u-siti",
      name: "Siti Rahayu",
      email: "siti.rahayu@gmail.com",
      password: "siti2026",
      role: "user",
      profile: {
        profession: "Guru SD Negeri",
        monthlyIncome: 6800000,
        incomeCategory: "Tetap",
        dependents: 3,
        educationCost: 900000,
        installmentCost: 1200000,
      },
    },
    {
      id: "u-agus",
      name: "Agus Setiawan",
      email: "agus.setiawan@gmail.com",
      password: "agus-jaya7",
      role: "user",
      profile: {
        profession: "Pedagang sembako",
        monthlyIncome: 9500000,
        incomeCategory: "Tidak Tetap",
        dependents: 4,
        educationCost: 1300000,
        installmentCost: 0,
      },
    },
    {
      id: "u-ahmad",
      name: "Ahmad Fauzi",
      email: "ahmad.fauzi@gmail.com",
      password: "panen2026",
      role: "user",
      profile: {
        profession: "Petani padi",
        monthlyIncome: 4500000,
        incomeCategory: "Musiman",
        dependents: 5,
        educationCost: 600000,
        installmentCost: 300000,
      },
    },
    {
      id: "u-dewi",
      name: "Dewi Lestari",
      email: "dewi.lestari@gmail.com",
      password: "dewi-sehat",
      role: "user",
      profile: {
        profession: "Perawat klinik swasta",
        monthlyIncome: 5200000,
        incomeCategory: "Tetap",
        dependents: 2,
        educationCost: 500000,
        installmentCost: 450000,
      },
    },
    {
      id: "admin",
      name: "Administrator",
      email: "admin@gmail.com",
      password: "admin12345",
      role: "admin",
      profile: { ...emptyProfile },
    },
  ],
  categories: [
    { id: "c-salary", name: "Gaji", type: "income" },
    { id: "c-business", name: "Usaha", type: "income" },
    { id: "c-bonus", name: "Bonus", type: "income" },
    { id: "c-other-income", name: "Pemasukan Lain", type: "income" },
    { id: "c-food", name: "Kebutuhan Pokok", type: "expense" },
    { id: "c-school", name: "Pendidikan", type: "expense" },
    { id: "c-bill", name: "Tagihan", type: "expense" },
    { id: "c-transport", name: "Transportasi", type: "expense" },
    { id: "c-other-expense", name: "Pengeluaran Lain", type: "expense" },
  ],
  transactions: [
    {
      id: "t-01",
      userId: "u-siti",
      type: "income",
      date: "2026-11-01",
      description: "Gaji bulanan",
      amount: 6800000,
      categoryId: "c-salary",
    },
    {
      id: "t-02",
      userId: "u-siti",
      type: "income",
      date: "2026-11-10",
      description: "Honor mengajar les",
      amount: 850000,
      categoryId: "c-other-income",
    },
    {
      id: "t-03",
      userId: "u-siti",
      type: "expense",
      date: "2026-11-02",
      description: "Belanja kebutuhan dapur",
      amount: 1950000,
      categoryId: "c-food",
    },
    {
      id: "t-04",
      userId: "u-siti",
      type: "expense",
      date: "2026-11-05",
      description: "Uang sekolah anak",
      amount: 900000,
      categoryId: "c-school",
    },
    {
      id: "t-05",
      userId: "u-siti",
      type: "expense",
      date: "2026-11-07",
      description: "Tagihan listrik dan air",
      amount: 420000,
      categoryId: "c-bill",
    },
    {
      id: "t-06",
      userId: "u-siti",
      type: "expense",
      date: "2026-11-09",
      description: "Bensin motor",
      amount: 350000,
      categoryId: "c-transport",
    },
    {
      id: "t-07",
      userId: "u-siti",
      type: "expense",
      date: "2026-11-10",
      description: "Cicilan motor",
      amount: 1200000,
      categoryId: "c-bill",
    },
    {
      id: "t-08",
      userId: "u-agus",
      type: "income",
      date: "2026-11-02",
      description: "Hasil jualan minggu pertama",
      amount: 4200000,
      categoryId: "c-business",
    },
    {
      id: "t-09",
      userId: "u-agus",
      type: "income",
      date: "2026-11-09",
      description: "Hasil jualan minggu kedua",
      amount: 3900000,
      categoryId: "c-business",
    },
    {
      id: "t-10",
      userId: "u-agus",
      type: "income",
      date: "2026-11-16",
      description: "Penjualan pasar pagi",
      amount: 1600000,
      categoryId: "c-business",
    },
    {
      id: "t-11",
      userId: "u-agus",
      type: "expense",
      date: "2026-11-03",
      description: "Belanja stok barang",
      amount: 3100000,
      categoryId: "c-food",
    },
    {
      id: "t-12",
      userId: "u-agus",
      type: "expense",
      date: "2026-11-05",
      description: "Uang sekolah anak",
      amount: 1300000,
      categoryId: "c-school",
    },
    {
      id: "t-13",
      userId: "u-agus",
      type: "expense",
      date: "2026-11-08",
      description: "Tagihan listrik",
      amount: 480000,
      categoryId: "c-bill",
    },
    {
      id: "t-14",
      userId: "u-agus",
      type: "expense",
      date: "2026-11-11",
      description: "Bensin mobil pickup",
      amount: 600000,
      categoryId: "c-transport",
    },
    {
      id: "t-15",
      userId: "u-agus",
      type: "expense",
      date: "2026-11-14",
      description: "Belanja kebutuhan rumah",
      amount: 1100000,
      categoryId: "c-food",
    },
    {
      id: "t-16",
      userId: "u-ahmad",
      type: "income",
      date: "2026-11-06",
      description: "Hasil panen padi",
      amount: 3600000,
      categoryId: "c-business",
    },
    {
      id: "t-17",
      userId: "u-ahmad",
      type: "income",
      date: "2026-11-15",
      description: "Penjualan sayur kebun",
      amount: 800000,
      categoryId: "c-business",
    },
    {
      id: "t-18",
      userId: "u-ahmad",
      type: "expense",
      date: "2026-11-04",
      description: "Pupuk dan bibit",
      amount: 1500000,
      categoryId: "c-other-expense",
    },
    {
      id: "t-19",
      userId: "u-ahmad",
      type: "expense",
      date: "2026-11-07",
      description: "Belanja dapur",
      amount: 1250000,
      categoryId: "c-food",
    },
    {
      id: "t-20",
      userId: "u-ahmad",
      type: "expense",
      date: "2026-11-08",
      description: "Biaya sekolah anak",
      amount: 600000,
      categoryId: "c-school",
    },
    {
      id: "t-21",
      userId: "u-ahmad",
      type: "expense",
      date: "2026-11-12",
      description: "Bensin dan listrik",
      amount: 450000,
      categoryId: "c-transport",
    },
    {
      id: "t-22",
      userId: "u-ahmad",
      type: "expense",
      date: "2026-11-13",
      description: "Cicilan traktor",
      amount: 300000,
      categoryId: "c-bill",
    },
    {
      id: "t-23",
      userId: "u-dewi",
      type: "income",
      date: "2026-11-01",
      description: "Gaji bulanan",
      amount: 5200000,
      categoryId: "c-salary",
    },
    {
      id: "t-24",
      userId: "u-dewi",
      type: "income",
      date: "2026-11-15",
      description: "Bonus jaga malam",
      amount: 400000,
      categoryId: "c-bonus",
    },
    {
      id: "t-25",
      userId: "u-dewi",
      type: "expense",
      date: "2026-11-02",
      description: "Belanja bulanan",
      amount: 1100000,
      categoryId: "c-food",
    },
    {
      id: "t-26",
      userId: "u-dewi",
      type: "expense",
      date: "2026-11-06",
      description: "Kos dan tagihan internet",
      amount: 800000,
      categoryId: "c-bill",
    },
    {
      id: "t-27",
      userId: "u-dewi",
      type: "expense",
      date: "2026-11-09",
      description: "Ongkos transportasi",
      amount: 300000,
      categoryId: "c-transport",
    },
    {
      id: "t-28",
      userId: "u-dewi",
      type: "expense",
      date: "2026-11-10",
      description: "Kursus anak",
      amount: 450000,
      categoryId: "c-school",
    },
    {
      id: "t-29",
      userId: "u-dewi",
      type: "expense",
      date: "2026-11-17",
      description: "Keperluan lain",
      amount: 350000,
      categoryId: "c-other-expense",
    },
  ],
};

const comparisonProfiles = [
  { p: "Pegawai", i: 6, d: 2, e: 0.8, a: 0.6, r: [50, 15, 15, 10, 10] },
  { p: "Pegawai", i: 9, d: 4, e: 1.6, a: 1.2, r: [44, 20, 14, 14, 8] },
  { p: "Pegawai", i: 14, d: 3, e: 2.1, a: 2.5, r: [38, 20, 20, 15, 7] },
  { p: "Pedagang", i: 7, d: 3, e: 0.7, a: 0.4, r: [52, 13, 20, 7, 8] },
  { p: "Pedagang", i: 11, d: 5, e: 1.9, a: 1.5, r: [46, 19, 16, 12, 7] },
  { p: "Pedagang", i: 16, d: 4, e: 2.4, a: 1.1, r: [40, 19, 25, 8, 8] },
  { p: "Petani", i: 5, d: 4, e: 0.5, a: 0.2, r: [57, 13, 18, 5, 7] },
  { p: "Petani", i: 10, d: 6, e: 1.5, a: 0.9, r: [50, 18, 17, 9, 6] },
  { p: "Petani", i: 13, d: 3, e: 1.2, a: 1.8, r: [42, 17, 21, 14, 6] },
] as const;

const recommendationNames = [
  "Kebutuhan Pokok",
  "Pendidikan",
  "Investasi dan Tabungan",
  "Angsuran",
  "Lainnya",
];

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, "");

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function loadStore(): Store {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialStore;
    const parsed = JSON.parse(saved) as Partial<Store>;
    if (
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.transactions) ||
      !Array.isArray(parsed.categories)
    )
      return initialStore;
    return {
      ...parsed,
      users: parsed.users.map((user) => ({
        ...user,
        email: user.email.replace(/@contoh\.id$/i, "@gmail.com"),
      })),
    } as Store;
  } catch {
    return initialStore;
  }
}

function saveStore(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* penyimpanan browser tidak tersedia */
  }
}

function readSession(): string {
  try {
    return sessionStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
}

function writeSession(id: string) {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* penyimpanan sesi tidak tersedia */
  }
}

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v10h13V10M9 20v-6h6v6" />
      </>
    ),
    up: (
      <>
        <path d="M12 20V5M6 11l6-6 6 6" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v15M6 13l6 6 6-6" />
      </>
    ),
    report: (
      <>
        <path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.7-4.3 3.4-7 8-7s7.3 2.7 8 7" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.5-4 2.7-6.5 6.5-6.5s6 2.5 6.5 6.5M16 5.5c2 0 3.5 1.5 3.5 3.5S18 12.5 16 12.5M17 15c2.7.2 4.2 2 4.5 5" />
      </>
    ),
    tag: (
      <>
        <path d="M3 4h7l11 11-6 6L4 10z" />
        <circle cx="8" cy="8" r="1" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4.5-1 10-10-3.5-3.5-10 10zM13.5 7l3.5 3.5" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 3h6l1 4M7 7l1 14h8l1-14M10 11v6M14 11v6" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    wallet: (
      <>
        <path d="M3 6h16v14H3zM3 9h18v7h-6a2 2 0 0 1 0-4h6" />
        <path d="M6 6V4h11v2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.home}
    </svg>
  );
}

const professionGroup = (text: string) => {
  const value = text.toLowerCase();
  if (/tani|kebun|ternak|sawah|nelayan/.test(value)) return "Petani";
  if (/dagang|jualan|warung|toko|usaha|pasar|sembako/.test(value)) return "Pedagang";
  if (/pegawai|karyawan|guru|dosen|perawat|dokter|bidan|pns|asn|kantor|staf/.test(value))
    return "Pegawai";
  return "Lainnya";
};

function calculateRecommendation(profile: Profile) {
  const profession = ["Pegawai", "Pedagang", "Petani"];
  const group = professionGroup(profile.profession);
  const vector = [
    ...profession.map((p) => (group === p ? 1 : 0)),
    profile.monthlyIncome / 1000000,
    profile.dependents,
    profile.educationCost / 1000000,
    profile.installmentCost / 1000000,
  ];
  const cosine = (a: number[], b: number[]) => {
    const dot = a.reduce((sum, value, i) => sum + value * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  };
  const weighted = [0, 0, 0, 0, 0];
  let totalWeight = 0;
  comparisonProfiles.forEach((item) => {
    const other = [
      ...profession.map((p) => (item.p === p ? 1 : 0)),
      item.i,
      item.d,
      item.e,
      item.a,
    ];
    const weight = cosine(vector, other);
    if (weight > 0) {
      item.r.forEach((value, index) => (weighted[index] += value * weight));
      totalWeight += weight;
    }
  });
  if (totalWeight === 0) return null;
  const raw = weighted.map((value) => value / totalWeight);
  const normalized = raw.map((value) => (value / raw.reduce((a, b) => a + b, 0)) * 100);
  const rounded = normalized.map(Math.floor);
  let remaining = 100 - rounded.reduce((a, b) => a + b, 0);
  normalized
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (remaining > 0) {
        rounded[index] += 1;
        remaining -= 1;
      }
    });
  return rounded;
}

function Modal({
  title,
  children,
  onClose,
  size = "normal",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "normal" | "wide";
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal ${size === "wide" ? "modal-wide" : ""}`}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [store, setStore] = useState<Store>(loadStore);
  const [sessionId, setSessionId] = useState(readSession);
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const user = store.users.find((item) => item.id === sessionId);

  useEffect(() => {
    document.title = "Aplikasi Pengelola Keuangan Keluarga";
    document.documentElement.lang = "id";
  }, []);
  useEffect(() => saveStore(store), [store]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const login = (id: string) => {
    writeSession(id);
    setSessionId(id);
    setPage(id === "admin" ? "users" : "dashboard");
  };
  const logout = () => {
    writeSession("");
    setSessionId("");
    setPage("dashboard");
  };
  const navigate = (next: Page) => {
    setPage(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return <AuthScreen store={store} setStore={setStore} login={login} />;
  }

  const navItems =
    user.role === "admin"
      ? [
          { page: "users" as Page, label: "Data Pengguna", icon: "users" },
          { page: "categories" as Page, label: "Kategori", icon: "tag" },
        ]
      : [
          { page: "dashboard" as Page, label: "Dashboard", icon: "home" },
          { page: "income" as Page, label: "Pemasukan", icon: "down" },
          { page: "expense" as Page, label: "Pengeluaran", icon: "up" },
          { page: "report" as Page, label: "Rekapan", icon: "report" },
          { page: "recommendation" as Page, label: "Rekomendasi", icon: "spark" },
          { page: "profile" as Page, label: "Profil & Kriteria", icon: "user" },
        ];

  return (
    <div className="app-shell">
      {mobileOpen && <div className="sidebar-shade" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Icon name="wallet" size={23} />
          </div>
          <div>
            <strong>KelolaKita</strong>
            <span>Keuangan Keluarga</span>
          </div>
        </div>
        <nav>
          <p className="nav-caption">{user.role === "admin" ? "ADMINISTRASI" : "MENU UTAMA"}</p>
          {navItems.map((item) => (
            <button
              key={item.page}
              className={`nav-item ${page === item.page ? "active" : ""}`}
              onClick={() => navigate(item.page)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar small">{initialsOf(user.name)}</div>
          <div className="user-meta">
            <strong>{user.name}</strong>
            <span>{user.role === "admin" ? "Administrator" : "Pengguna Keluarga"}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Keluar">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="mobile-header">
          <button className="icon-btn" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
            <Icon name="menu" />
          </button>
          <div className="brand compact">
            <div className="brand-mark">
              <Icon name="wallet" size={20} />
            </div>
            <strong>KelolaKita</strong>
          </div>
          <div className="avatar tiny">{initialsOf(user.name)}</div>
        </header>
        <div className="content">
          {user.role === "user" && page === "dashboard" && (
            <Dashboard user={user} store={store} navigate={navigate} />
          )}
          {user.role === "user" && (page === "income" || page === "expense") && (
            <TransactionsPage
              type={page === "income" ? "income" : "expense"}
              user={user}
              store={store}
              setStore={setStore}
              notify={setToast}
            />
          )}
          {user.role === "user" && page === "report" && <ReportPage user={user} store={store} />}
          {user.role === "user" && page === "profile" && (
            <ProfilePage user={user} setStore={setStore} notify={setToast} />
          )}
          {user.role === "user" && page === "recommendation" && (
            <RecommendationPage user={user} store={store} navigate={navigate} />
          )}
          {user.role === "admin" && page === "users" && (
            <AdminUsers store={store} setStore={setStore} notify={setToast} />
          )}
          {user.role === "admin" && page === "categories" && (
            <AdminCategories store={store} setStore={setStore} notify={setToast} />
          )}
        </div>
      </main>
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={17} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

function AuthScreen({
  store,
  setStore,
  login,
}: {
  store: Store;
  setStore: (value: Store) => void;
  login: (id: string) => void;
}) {
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = normalizeEmail(String(data.get("email")));
    const password = String(data.get("password"));
    const found = store.users.find((user) => user.email === email && user.password === password);
    if (!found) return setError("Email atau kata sandi tidak sesuai. Silakan periksa kembali.");
    login(found.id);
  };
  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("name")).trim()) return setError("Nama lengkap wajib diisi.");
    const email = normalizeEmail(String(data.get("email")));
    if (store.users.some((user) => user.email === email))
      return setError("Email ini sudah terdaftar.");
    const newUser: User = {
      id: uid(),
      name: String(data.get("name")).trim(),
      email,
      password: String(data.get("password")),
      role: "user",
      profile: {
        profession: "",
        monthlyIncome: 0,
        incomeCategory: "",
        dependents: 0,
        educationCost: 0,
        installmentCost: 0,
      },
    };
    setStore({ ...store, users: [...store.users, newUser] });
    login(newUser.id);
  };

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <div className="auth-brand">
          <div className="brand-mark">
            <Icon name="wallet" size={24} />
          </div>
          <strong>KelolaKita</strong>
        </div>
        <div className="intro-copy">
          <span className="eyebrow light">APLIKASI KEUANGAN KELUARGA</span>
          <h1>
            Keuangan keluarga,
            <br />
            lebih terarah.
          </h1>
          <p>
            Catat pemasukan, kendalikan pengeluaran, dan susun rencana keuangan yang sesuai untuk
            keluarga Anda.
          </p>
          <div className="feature-line">
            <span>
              <Icon name="check" size={16} />
            </span>{" "}
            Pencatatan praktis dan transparan
          </div>
          <div className="feature-line">
            <span>
              <Icon name="check" size={16} />
            </span>{" "}
            Rekomendasi sesuai profil keluarga
          </div>
          <div className="feature-line">
            <span>
              <Icon name="check" size={16} />
            </span>{" "}
            Rekapan keuangan dalam satu tempat
          </div>
        </div>
        <p className="auth-foot">Data disimpan di browser perangkat ini.</p>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <h2>{register ? "Daftar akun keluarga" : "Selamat datang"}</h2>
          <p>
            {register
              ? "Buat akun untuk mulai mengelola keuangan keluarga."
              : "Masuk untuk melanjutkan ke ruang keuangan keluarga Anda."}
          </p>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={register ? handleRegister : handleLogin}>
            {register && (
              <label>
                Nama lengkap
                <input name="name" placeholder="Nama Anda" required />
              </label>
            )}
            <label>
              Alamat email
              <input name="email" type="email" placeholder="nama@email.com" required />
            </label>
            <label>
              Kata sandi
              <input
                name="password"
                type="password"
                placeholder="Minimal 6 karakter"
                minLength={register ? 6 : undefined}
                required
              />
            </label>
            <button className="btn primary full" type="submit">
              {register ? "Daftar Sekarang" : "Masuk"}
            </button>
          </form>
          <p className="switch-auth">
            {register ? "Sudah memiliki akun?" : "Belum memiliki akun?"}{" "}
            <button
              onClick={() => {
                setRegister(!register);
                setError("");
              }}
            >
              {register ? "Masuk" : "Daftar"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Dashboard({
  user,
  store,
  navigate,
}: {
  user: User;
  store: Store;
  navigate: (p: Page) => void;
}) {
  const txs = store.transactions.filter((tx) => tx.userId === user.id);
  const income = txs.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const expense = txs.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const categoryName = (id: string) =>
    store.categories.find((cat) => cat.id === id)?.name || "Tanpa kategori";
  return (
    <>
      <PageHeader
        eyebrow="RINGKASAN KEUANGAN"
        title={`Halo, ${user.name.split(" ")[0]}!`}
        description="Berikut kondisi keuangan keluarga Anda saat ini."
      />
      <div className="balance-grid">
        <div className="balance-card featured">
          <div className="balance-icon">
            <Icon name="wallet" />
          </div>
          <span>Saldo Saat Ini</span>
          <strong>{rupiah(income - expense)}</strong>
          <small>Diperbarui otomatis dari seluruh transaksi</small>
        </div>
        <div className="balance-card">
          <div className="balance-icon income">
            <Icon name="down" />
          </div>
          <span>Total Pemasukan</span>
          <strong>{rupiah(income)}</strong>
          <small>{txs.filter((tx) => tx.type === "income").length} transaksi tercatat</small>
        </div>
        <div className="balance-card">
          <div className="balance-icon expense">
            <Icon name="up" />
          </div>
          <span>Total Pengeluaran</span>
          <strong>{rupiah(expense)}</strong>
          <small>{txs.filter((tx) => tx.type === "expense").length} transaksi tercatat</small>
        </div>
      </div>
      <div className="section-title">
        <div>
          <h2>Akses Cepat</h2>
          <p>Kelola keuangan keluarga tanpa langkah panjang.</p>
        </div>
      </div>
      <div className="quick-grid">
        {[
          ["Input Pemasukan", "Catat pendapatan baru", "income", "down"],
          ["Input Pengeluaran", "Catat biaya keluarga", "expense", "up"],
          ["Rekomendasi Pengeluaran", "Lihat alokasi yang disarankan", "recommendation", "spark"],
          ["Rekapan", "Tinjau arus keuangan", "report", "report"],
        ].map(([title, text, target, icon]) => (
          <button key={title} className="quick-card" onClick={() => navigate(target as Page)}>
            <span className={`quick-icon ${target}`}>
              <Icon name={icon} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <b>→</b>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Transaksi Terbaru</h2>
            <p>Aktivitas keuangan terakhir Anda</p>
          </div>
          {txs.length > 0 && (
            <button className="text-btn" onClick={() => navigate("report")}>
              Lihat semua →
            </button>
          )}
        </div>
        {recent.length ? (
          <div className="transaction-list">
            {recent.map((tx) => (
              <div className="transaction-row" key={tx.id}>
                <span className={`tx-symbol ${tx.type}`}>
                  <Icon name={tx.type === "income" ? "down" : "up"} size={18} />
                </span>
                <div>
                  <strong>{tx.description}</strong>
                  <small>
                    {dateLabel(tx.date)} · {categoryName(tx.categoryId)}
                  </small>
                </div>
                <b className={tx.type}>
                  {tx.type === "income" ? "+" : "−"}
                  {rupiah(tx.amount)}
                </b>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>
              <Icon name="report" size={28} />
            </span>
            <h3>Belum ada transaksi</h3>
            <p>Mulai catat pemasukan atau pengeluaran keluarga Anda.</p>
            <button className="btn primary" onClick={() => navigate("income")}>
              Input Pemasukan
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function TransactionsPage({
  type,
  user,
  store,
  setStore,
  notify,
}: {
  type: TxType;
  user: User;
  store: Store;
  setStore: (value: Store) => void;
  notify: (message: string) => void;
}) {
  const [editing, setEditing] = useState<Transaction | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const isIncome = type === "income";
  const transactions = store.transactions
    .filter((tx) => tx.userId === user.id && tx.type === type)
    .sort((a, b) => b.date.localeCompare(a.date));
  const categories = store.categories.filter((cat) => cat.type === type);
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const tx: Transaction = {
      id: editing?.id || uid(),
      userId: user.id,
      type,
      date: String(data.get("date")),
      description: String(data.get("description")).trim(),
      amount: Number(data.get("amount")),
      categoryId: String(data.get("category")),
    };
    if (!tx.date) return notify("Tanggal wajib diisi.");
    if (!tx.description) return notify("Keterangan wajib diisi.");
    if (!(tx.amount > 0)) return notify("Jumlah harus lebih dari nol.");
    setStore({
      ...store,
      transactions: editing
        ? store.transactions.map((item) => (item.id === editing.id ? tx : item))
        : [...store.transactions, tx],
    });
    setEditing(undefined);
    notify(
      `${isIncome ? "Pemasukan" : "Pengeluaran"} berhasil ${editing ? "diperbarui" : "disimpan"}.`,
    );
  };
  const remove = () => {
    if (!deleting) return;
    setStore({ ...store, transactions: store.transactions.filter((tx) => tx.id !== deleting.id) });
    setDeleting(null);
    notify(`${isIncome ? "Pemasukan" : "Pengeluaran"} berhasil dihapus.`);
  };
  return (
    <>
      <PageHeader
        eyebrow="TRANSAKSI"
        title={isIncome ? "Pemasukan" : "Pengeluaran"}
        description={`Catat dan kelola seluruh ${isIncome ? "pendapatan" : "pengeluaran"} keluarga Anda.`}
        action={
          <button className="btn primary" onClick={() => setEditing(null)}>
            <Icon name="plus" size={18} /> Tambah {isIncome ? "Pemasukan" : "Pengeluaran"}
          </button>
        }
      />
      <div className="summary-strip">
        <span className={`summary-icon ${type}`}>
          <Icon name={isIncome ? "down" : "up"} />
        </span>
        <div>
          <small>Total {isIncome ? "Pemasukan" : "Pengeluaran"}</small>
          <strong>{rupiah(total)}</strong>
        </div>
        <div className="summary-count">
          <strong>{transactions.length}</strong>
          <small>Transaksi</small>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div>
            <h2>Riwayat {isIncome ? "Pemasukan" : "Pengeluaran"}</h2>
            <p>Semua transaksi yang telah tercatat</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{dateLabel(tx.date)}</td>
                  <td className="strong-cell">{tx.description}</td>
                  <td>
                    <span className={`type-badge ${type}`}>
                      {store.categories.find((cat) => cat.id === tx.categoryId)?.name || "Dihapus"}
                    </span>
                  </td>
                  <td className={type}>
                    {type === "income" ? "+" : "−"}
                    {rupiah(tx.amount)}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => setEditing(tx)}>
                        <Icon name="edit" size={16} /> Ubah
                      </button>
                      <button className="danger" onClick={() => setDeleting(tx)}>
                        <Icon name="trash" size={16} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!transactions.length && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty compact-empty">
                      Belum ada {isIncome ? "pemasukan" : "pengeluaran"} tercatat.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing !== undefined && (
        <Modal
          title={`${editing ? "Ubah" : "Tambah"} ${isIncome ? "Pemasukan" : "Pengeluaran"}`}
          onClose={() => setEditing(undefined)}
        >
          <form className="form-grid" onSubmit={save}>
            <label>
              Tanggal
              <input
                type="date"
                name="date"
                defaultValue={editing?.date || today}
                max="2100-12-31"
                required
              />
            </label>
            <label>
              Kategori
              <select
                name="category"
                defaultValue={editing?.categoryId || categories[0]?.id}
                required
              >
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="full-field">
              Keterangan
              <input
                name="description"
                defaultValue={editing?.description}
                placeholder={isIncome ? "Contoh: Gaji bulanan" : "Contoh: Belanja kebutuhan rumah"}
                required
              />
            </label>
            <label className="full-field">
              Jumlah (Rupiah)
              <div className="money-input">
                <span>Rp</span>
                <input
                  name="amount"
                  type="number"
                  min="1"
                  defaultValue={editing?.amount}
                  placeholder="0"
                  required
                />
              </div>
              <small>Masukkan jumlah positif tanpa tanda titik.</small>
            </label>
            <div className="form-actions full-field">
              <button type="button" className="btn ghost" onClick={() => setEditing(undefined)}>
                Batal
              </button>
              <button className="btn primary">
                Simpan {isIncome ? "Pemasukan" : "Pengeluaran"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="Hapus transaksi?" onClose={() => setDeleting(null)}>
          <div className="confirm-copy">
            <div className="danger-symbol">
              <Icon name="trash" />
            </div>
            <p>
              Transaksi <strong>{deleting.description}</strong> sebesar{" "}
              <strong>{rupiah(deleting.amount)}</strong> akan dihapus permanen. Saldo dan rekapan
              akan dihitung ulang.
            </p>
          </div>
          <div className="form-actions">
            <button className="btn ghost" onClick={() => setDeleting(null)}>
              Batal
            </button>
            <button className="btn danger-btn" onClick={remove}>
              Ya, Hapus
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function ReportPage({ user, store }: { user: User; store: Store }) {
  const [draftStart, setDraftStart] = useState(monthStart);
  const [draftEnd, setDraftEnd] = useState(today);
  const [range, setRange] = useState({ start: monthStart, end: today });
  const invalidRange = !draftStart || !draftEnd || draftStart > draftEnd;
  const userTx = store.transactions.filter((tx) => tx.userId === user.id);
  const before = userTx
    .filter((tx) => tx.date < range.start)
    .reduce((sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount), 0);
  const period = userTx
    .filter((tx) => tx.date >= range.start && tx.date <= range.end)
    .sort((a, b) => a.date.localeCompare(b.date));
  const income = period
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expense = period
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  return (
    <>
      <PageHeader
        eyebrow="LAPORAN"
        title="Rekapan Keuangan"
        description="Tinjau arus pemasukan dan pengeluaran berdasarkan periode."
      />
      <div className="card filter-card">
        <div>
          <label>
            Dari tanggal
            <input type="date" value={draftStart} onChange={(e) => setDraftStart(e.target.value)} />
          </label>
          <label>
            Sampai tanggal
            <input type="date" value={draftEnd} onChange={(e) => setDraftEnd(e.target.value)} />
          </label>
        </div>
        <button
          className="btn primary"
          disabled={invalidRange}
          onClick={() => setRange({ start: draftStart, end: draftEnd })}
        >
          Tampil
        </button>
      </div>
      {invalidRange && (
        <div className="error-box">
          Lengkapi tanggal dan pastikan tanggal awal tidak melebihi tanggal akhir.
        </div>
      )}
      <div className="report-grid">
        {[
          ["Saldo Sebelum Periode", before, "neutral"],
          ["Total Pemasukan", income, "income"],
          ["Total Pengeluaran", expense, "expense"],
          ["Saldo Akhir Periode", before + income - expense, "primary"],
        ].map(([label, value, tone]) => (
          <div className={`mini-stat ${tone}`} key={String(label)}>
            <small>{label}</small>
            <strong>{rupiah(Number(value))}</strong>
          </div>
        ))}
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div>
            <h2>Rincian Transaksi</h2>
            <p>
              {dateLabel(range.start)} — {dateLabel(range.end)}
            </p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pemasukan</th>
                <th>Pengeluaran</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {period.map((tx) => (
                <tr key={tx.id}>
                  <td>{dateLabel(tx.date)}</td>
                  <td className="income">{tx.type === "income" ? rupiah(tx.amount) : "—"}</td>
                  <td className="expense">{tx.type === "expense" ? rupiah(tx.amount) : "—"}</td>
                  <td className="strong-cell">{tx.description}</td>
                </tr>
              ))}
              {!period.length && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty compact-empty">Tidak ada transaksi pada periode ini.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProfilePage({
  user,
  setStore,
  notify,
}: {
  user: User;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  notify: (s: string) => void;
}) {
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const profile: Profile = {
      profession: String(data.get("profession")).trim(),
      monthlyIncome: Number(data.get("income")),
      incomeCategory: String(data.get("incomeCategory")),
      dependents: Number(data.get("dependents")),
      educationCost: Number(data.get("education")),
      installmentCost: Number(data.get("installment")),
    };
    setStore((current) => ({
      ...current,
      users: current.users.map((item) => (item.id === user.id ? { ...item, profile } : item)),
    }));
    notify("Profil dan kriteria berhasil diperbarui. Rekomendasi telah dihitung ulang.");
  };
  return (
    <>
      <PageHeader
        eyebrow="AKUN KELUARGA"
        title="Profil & Kriteria"
        description="Lengkapi kondisi keluarga untuk memperoleh rekomendasi yang lebih sesuai."
      />
      <div className="profile-layout">
        <div className="card profile-card">
          <div className="avatar large">{initialsOf(user.name)}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="verified">
            <Icon name="check" size={14} /> Akun keluarga aktif
          </span>
          <div className="profile-summary">
            <div>
              <small>Pendapatan bulanan</small>
              <strong>{rupiah(user.profile.monthlyIncome)}</strong>
            </div>
            <div>
              <small>Anggota / tanggungan</small>
              <strong>{user.profile.dependents} orang</strong>
            </div>
          </div>
        </div>
        <div className="card profile-form">
          <div className="card-head">
            <div>
              <h2>Kriteria Keuangan Keluarga</h2>
              <p>Data ini digunakan untuk menghitung rekomendasi pengeluaran.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={save}>
            <label>
              Pekerjaan
              <input
                name="profession"
                list="profession-options"
                defaultValue={user.profile.profession}
                placeholder="Tulis pekerjaan, contoh: Guru SD"
                maxLength={80}
                required
              />
              <datalist id="profession-options">
                <option value="Pegawai" />
                <option value="Guru" />
                <option value="Perawat" />
                <option value="Pedagang" />
                <option value="Petani" />
                <option value="Wiraswasta" />
              </datalist>
            </label>
            <label>
              Kategori pendapatan
              <select name="incomeCategory" defaultValue={user.profile.incomeCategory} required>
                <option value="" disabled>
                  Pilih kategori
                </option>
                <option>Tetap</option>
                <option>Tidak Tetap</option>
                <option>Musiman</option>
              </select>
            </label>
            <label>
              Pendapatan bulanan
              <div className="money-input">
                <span>Rp</span>
                <input
                  name="income"
                  type="number"
                  min="1"
                  defaultValue={user.profile.monthlyIncome}
                  required
                />
              </div>
            </label>
            <label>
              Jumlah anggota / tanggungan
              <input
                name="dependents"
                type="number"
                min="0"
                defaultValue={user.profile.dependents}
                required
              />
            </label>
            <label>
              Biaya pendidikan bulanan
              <div className="money-input">
                <span>Rp</span>
                <input
                  name="education"
                  type="number"
                  min="0"
                  defaultValue={user.profile.educationCost}
                  required
                />
              </div>
              <small>Isi 0 jika tidak ada.</small>
            </label>
            <label>
              Biaya angsuran bulanan
              <div className="money-input">
                <span>Rp</span>
                <input
                  name="installment"
                  type="number"
                  min="0"
                  defaultValue={user.profile.installmentCost}
                  required
                />
              </div>
              <small>Isi 0 jika tidak ada.</small>
            </label>
            <div className="form-actions full-field">
              <button className="btn primary">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function RecommendationPage({
  user,
  store,
  navigate,
}: {
  user: User;
  store: Store;
  navigate: (p: Page) => void;
}) {
  const complete =
    !!user.profile.profession && user.profile.monthlyIncome > 0 && !!user.profile.incomeCategory;
  const percentages = complete ? calculateRecommendation(user.profile) : null;
  const month = today.slice(0, 7);
  const current = store.transactions.filter(
    (tx) => tx.userId === user.id && tx.date.startsWith(month),
  );
  const income = current
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expense = current
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const all = store.transactions.filter((tx) => tx.userId === user.id);
  const balance = all.reduce((sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount), 0);
  return (
    <>
      <PageHeader
        eyebrow="ANALISIS CERDAS"
        title="Rekomendasi Pengeluaran"
        description="Saran pembagian dana berdasarkan profil keuangan keluarga yang mirip."
      />
      {!complete ? (
        <div className="card empty recommendation-empty">
          <span>
            <Icon name="user" size={30} />
          </span>
          <h2>Profil belum lengkap</h2>
          <p>Lengkapi profesi, pendapatan, dan kondisi keluarga agar rekomendasi dapat dihitung.</p>
          <button className="btn primary" onClick={() => navigate("profile")}>
            Lengkapi Profil
          </button>
        </div>
      ) : !percentages ? (
        <div className="card empty">
          <h2>Data pembanding belum cukup</h2>
          <p>Rekomendasi akan tersedia setelah data pembanding mencukupi.</p>
        </div>
      ) : (
        <>
          <div className="recommendation-note">
            <span>
              <Icon name="spark" />
            </span>
            <div>
              <strong>Alokasi disesuaikan untuk keluarga Anda</strong>
              <p>
                Dihitung dengan User-Based Collaborative Filtering dari {comparisonProfiles.length}{" "}
                profil pembanding dan diperbarui setiap kali kriteria berubah.
              </p>
            </div>
          </div>
          <div className="card table-card">
            <div className="card-head">
              <div>
                <h2>Rencana Alokasi Dana</h2>
                <p>Persentase rekomendasi telah dinormalisasi menjadi tepat 100%.</p>
              </div>
              <div className="total-percent">
                <small>Total</small>
                <strong>100%</strong>
              </div>
            </div>
            <div className="table-wrap">
              <table className="recommendation-table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Persentase Rekomendasi</th>
                    <th>Alokasi dari Pendapatan Bulanan</th>
                    <th>Alokasi dari Dana Tersedia</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendationNames.map((name, index) => (
                    <tr key={name}>
                      <td className="strong-cell">
                        <span className={`category-dot dot-${index}`} />
                        {name}
                      </td>
                      <td>
                        <div className="percentage-cell">
                          <div>
                            <span style={{ width: `${percentages[index]}%` }} />
                          </div>
                          <strong>{percentages[index]}%</strong>
                        </div>
                      </td>
                      <td>{rupiah((user.profile.monthlyIncome * percentages[index]) / 100)}</td>
                      <td>{rupiah((Math.max(0, balance) * percentages[index]) / 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="recommendation-summary">
            {[
              ["Pendapatan pada Profil", user.profile.monthlyIncome],
              ["Pemasukan Aktual Bulan Ini", income],
              ["Pengeluaran Aktual Bulan Ini", expense],
              ["Saldo Saat Ini", balance],
            ].map(([label, value], index) => (
              <div key={String(label)}>
                <span className={`rec-icon rec-${index}`}>
                  <Icon name={index === 2 ? "up" : index === 3 ? "wallet" : "down"} size={19} />
                </span>
                <small>{label}</small>
                <strong>{rupiah(Number(value))}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function AdminUsers({
  store,
  setStore,
  notify,
}: {
  store: Store;
  setStore: (s: Store) => void;
  notify: (s: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<User | null | undefined>(undefined);
  const [history, setHistory] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const users = store.users.filter(
    (u) => u.role === "user" && `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = new FormData(event.currentTarget);
    const name = String(d.get("name")).trim();
    const email = normalizeEmail(String(d.get("email")));
    const newPassword = String(d.get("password") || "");
    if (!name) return notify("Nama lengkap wajib diisi.");
    if (store.users.some((u) => u.email === email && u.id !== editing?.id))
      return notify("Email ini sudah digunakan pengguna lain.");
    if ((!editing || newPassword) && newPassword.length < 6)
      return notify("Kata sandi minimal 6 karakter.");
    const next: User = {
      id: editing?.id || uid(),
      role: "user",
      name,
      email,
      password: newPassword || editing?.password || "",
      profile: {
        profession: String(d.get("profession")).trim(),
        monthlyIncome: Number(d.get("income")),
        incomeCategory: String(d.get("incomeCategory")),
        dependents: Number(d.get("dependents")),
        educationCost: Number(d.get("education")),
        installmentCost: Number(d.get("installment")),
      },
    };
    setStore({
      ...store,
      users: editing
        ? store.users.map((u) => (u.id === editing.id ? next : u))
        : [...store.users, next],
    });
    setEditing(undefined);
    notify(`Data pengguna berhasil ${editing ? "diperbarui" : "ditambahkan"}.`);
  };
  const remove = () => {
    if (!deleting) return;
    setStore({
      ...store,
      users: store.users.filter((u) => u.id !== deleting.id),
      transactions: store.transactions.filter((t) => t.userId !== deleting.id),
    });
    setDeleting(null);
    notify("Pengguna dan data transaksinya berhasil dihapus.");
  };
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRASI"
        title="Data Pengguna"
        description="Kelola profil dan pantau aktivitas pengguna keluarga."
        action={
          <button className="btn primary" onClick={() => setEditing(null)}>
            <Icon name="plus" size={18} /> Tambah Pengguna
          </button>
        }
      />
      <div className="card table-card">
        <div className="card-head admin-table-head">
          <div>
            <h2>Daftar Pengguna</h2>
            <p>{users.length} pengguna ditemukan</p>
          </div>
          <div className="search-box">
            <Icon name="search" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Pekerjaan</th>
                <th>Pendapatan</th>
                <th>Anggota</th>
                <th>Pendidikan</th>
                <th>Angsuran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="name-cell">
                      <span className="avatar tiny">{initialsOf(u.name)}</span>
                      <div>
                        <strong>{u.name}</strong>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{u.profile.profession || "Belum diisi"}</td>
                  <td>{rupiah(u.profile.monthlyIncome)}</td>
                  <td>{u.profile.dependents} orang</td>
                  <td>{rupiah(u.profile.educationCost)}</td>
                  <td>{rupiah(u.profile.installmentCost)}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => setHistory(u)} title="Riwayat">
                        <Icon name="eye" size={17} />
                      </button>
                      <button onClick={() => setEditing(u)} title="Ubah">
                        <Icon name="edit" size={17} />
                      </button>
                      <button className="danger" onClick={() => setDeleting(u)} title="Hapus">
                        <Icon name="trash" size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing !== undefined && (
        <Modal
          title={`${editing ? "Ubah" : "Tambah"} Pengguna`}
          onClose={() => setEditing(undefined)}
        >
          <form className="form-grid" onSubmit={save}>
            <label>
              Nama lengkap
              <input name="name" defaultValue={editing?.name} required />
            </label>
            <label>
              Email
              <input name="email" type="email" defaultValue={editing?.email} required />
            </label>
            <label>
              Kata sandi
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={editing ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                required={!editing}
              />
              <small>
                {editing
                  ? "Isi hanya jika ingin mengganti kata sandi."
                  : "Kata sandi untuk masuk ke akun ini."}
              </small>
            </label>
            <label>
              Pekerjaan
              <input
                name="profession"
                list="profession-options"
                defaultValue={editing?.profile.profession || ""}
                placeholder="Tulis pekerjaan, contoh: Petani padi"
                maxLength={80}
                required
              />
              <datalist id="profession-options">
                <option value="Pegawai" />
                <option value="Guru" />
                <option value="Perawat" />
                <option value="Pedagang" />
                <option value="Petani" />
                <option value="Wiraswasta" />
              </datalist>
            </label>
            <label>
              Kategori pendapatan
              <select
                name="incomeCategory"
                defaultValue={editing?.profile.incomeCategory || "Tetap"}
              >
                <option>Tetap</option>
                <option>Tidak Tetap</option>
                <option>Musiman</option>
              </select>
            </label>
            <label>
              Pendapatan
              <input
                name="income"
                type="number"
                min="0"
                defaultValue={editing?.profile.monthlyIncome || 0}
                required
              />
            </label>
            <label>
              Jumlah anggota
              <input
                name="dependents"
                type="number"
                min="0"
                defaultValue={editing?.profile.dependents || 0}
                required
              />
            </label>
            <label>
              Biaya pendidikan
              <input
                name="education"
                type="number"
                min="0"
                defaultValue={editing?.profile.educationCost || 0}
                required
              />
            </label>
            <label>
              Angsuran
              <input
                name="installment"
                type="number"
                min="0"
                defaultValue={editing?.profile.installmentCost || 0}
                required
              />
            </label>
            <div className="form-actions full-field">
              <button type="button" className="btn ghost" onClick={() => setEditing(undefined)}>
                Batal
              </button>
              <button className="btn primary">Simpan Pengguna</button>
            </div>
          </form>
        </Modal>
      )}
      {history && (
        <Modal
          title={`Riwayat Transaksi — ${history.name}`}
          onClose={() => setHistory(null)}
          size="wide"
        >
          <div className="table-wrap modal-table">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {store.transactions
                  .filter((t) => t.userId === history.id)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((t) => (
                    <tr key={t.id}>
                      <td>{dateLabel(t.date)}</td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td>{t.description}</td>
                      <td className={t.type}>{rupiah(t.amount)}</td>
                    </tr>
                  ))}
                {!store.transactions.some((t) => t.userId === history.id) && (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty compact-empty">Pengguna belum memiliki transaksi.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal title="Hapus pengguna?" onClose={() => setDeleting(null)}>
          <div className="confirm-copy">
            <div className="danger-symbol">
              <Icon name="trash" />
            </div>
            <p>
              Akun <strong>{deleting.name}</strong> dan seluruh riwayat transaksinya akan dihapus
              permanen.
            </p>
          </div>
          <div className="form-actions">
            <button className="btn ghost" onClick={() => setDeleting(null)}>
              Batal
            </button>
            <button className="btn danger-btn" onClick={remove}>
              Ya, Hapus
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AdminCategories({
  store,
  setStore,
  notify,
}: {
  store: Store;
  setStore: (s: Store) => void;
  notify: (s: string) => void;
}) {
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);
  const [blocked, setBlocked] = useState<Category | null>(null);
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = new FormData(event.currentTarget);
    const cat: Category = {
      id: editing?.id || uid(),
      name: String(d.get("name")).trim(),
      type: d.get("type") as TxType,
    };
    if (!cat.name) return notify("Nama kategori wajib diisi.");
    if (
      editing &&
      editing.type !== cat.type &&
      store.transactions.some((t) => t.categoryId === editing.id)
    )
      return notify("Jenis kategori tidak dapat diubah karena masih dipakai transaksi.");
    setStore({
      ...store,
      categories: editing
        ? store.categories.map((c) => (c.id === editing.id ? cat : c))
        : [...store.categories, cat],
    });
    setEditing(undefined);
    notify(`Kategori berhasil ${editing ? "diperbarui" : "ditambahkan"}.`);
  };
  const requestDelete = (cat: Category) => {
    if (store.transactions.some((t) => t.categoryId === cat.id)) return setBlocked(cat);
    if (store.categories.filter((c) => c.type === cat.type).length <= 1)
      return notify("Minimal harus ada satu kategori untuk jenis ini.");
    setStore({ ...store, categories: store.categories.filter((c) => c.id !== cat.id) });
    notify("Kategori berhasil dihapus.");
  };
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRASI"
        title="Kategori Transaksi"
        description="Atur pilihan kategori pemasukan dan pengeluaran."
        action={
          <button className="btn primary" onClick={() => setEditing(null)}>
            <Icon name="plus" size={18} /> Tambah Kategori
          </button>
        }
      />
      <div className="category-grid">
        {(["income", "expense"] as TxType[]).map((type) => (
          <div className="card category-card" key={type}>
            <div className="card-head">
              <div>
                <h2>{type === "income" ? "Pemasukan" : "Pengeluaran"}</h2>
                <p>{store.categories.filter((c) => c.type === type).length} kategori tersedia</p>
              </div>
              <span className={`category-head-icon ${type}`}>
                <Icon name={type === "income" ? "down" : "up"} />
              </span>
            </div>
            <div className="category-list">
              {store.categories
                .filter((c) => c.type === type)
                .map((cat) => (
                  <div key={cat.id}>
                    <span className={`category-dot ${type}`} />
                    <strong>{cat.name}</strong>
                    <span className={`type-badge ${type}`}>
                      {type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                    <div className="table-actions">
                      <button onClick={() => setEditing(cat)}>
                        <Icon name="edit" size={16} />
                      </button>
                      <button className="danger" onClick={() => requestDelete(cat)}>
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {editing !== undefined && (
        <Modal
          title={`${editing ? "Ubah" : "Tambah"} Kategori`}
          onClose={() => setEditing(undefined)}
        >
          <form className="form-grid" onSubmit={save}>
            <label className="full-field">
              Nama kategori
              <input
                name="name"
                defaultValue={editing?.name}
                placeholder="Contoh: Kesehatan"
                required
              />
            </label>
            <label className="full-field">
              Jenis transaksi
              <select name="type" defaultValue={editing?.type || "expense"}>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </label>
            <div className="form-actions full-field">
              <button type="button" className="btn ghost" onClick={() => setEditing(undefined)}>
                Batal
              </button>
              <button className="btn primary">Simpan Kategori</button>
            </div>
          </form>
        </Modal>
      )}
      {blocked && (
        <Modal title="Kategori tidak dapat dihapus" onClose={() => setBlocked(null)}>
          <div className="warning-box">
            <strong>{blocked.name} masih digunakan</strong>
            <p>
              Ada {store.transactions.filter((t) => t.categoryId === blocked.id).length} transaksi
              yang menggunakan kategori ini. Ubah kategori pada transaksi terkait terlebih dahulu.
            </p>
          </div>
          <div className="form-actions">
            <button className="btn primary" onClick={() => setBlocked(null)}>
              Saya Mengerti
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default App;

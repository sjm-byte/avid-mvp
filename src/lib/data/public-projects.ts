/**
 * Real public projects catalog (static mock — no DB).
 * Image files: /public/assets/projects/public/{id}-cover.jpg
 *
 * Display order is by startDate (Jalali) newest first — not by id order.
 */

export type PublicProjectListingStatus = "listed" | "published";

export interface PublicProject {
  id: string;
  title: string;
  activity: string;
  /** Participation capital (تومان). */
  amount: number;
  /** Jalali start date YYYY/MM/DD. */
  startDate: string;
  duration: string;
  /** Predicted return wording — never guaranteed. */
  predictedReturn: string;
  image: string;
  /** English-safe slug = id (p001, p002, …). */
  slug: string;
  /**
   * Listing visibility only — does not claim active/completed lifecycle.
   * Default: listed.
   */
  status: PublicProjectListingStatus;
}

function coverImage(id: string): string {
  return `/assets/projects/public/${id}-cover.jpg`;
}

/** Exact source list; dates normalized to Jalali YYYY/MM/DD. */
export const PUBLIC_PROJECTS: PublicProject[] = [
  {
    id: "p001",
    title: "همیار مکانیک کوشا",
    activity: "تولیدکننده پله‌رو گردشی و هوم‌لیفت",
    amount: 2_000_000_000,
    startDate: "1403/11/12",
    duration: "۲٫۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۱۲٫۵٪",
    image: coverImage("p001"),
    slug: "p001",
    status: "listed",
  },
  {
    id: "p002",
    title: "بهراد رویش رویان",
    activity: "تولیدکننده تجهیزات ناباروری",
    amount: 2_000_000_000,
    startDate: "1403/02/08",
    duration: "۴ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۲٫۵٪",
    image: coverImage("p002"),
    slug: "p002",
    status: "listed",
  },
  {
    id: "p003",
    title: "توی سیتی",
    activity: "تولیدکننده اسباب‌بازی",
    amount: 2_000_000_000,
    startDate: "1404/05/20",
    duration: "۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۷٪",
    image: coverImage("p003"),
    slug: "p003",
    status: "listed",
  },
  {
    id: "p004",
    title: "گلدیس",
    activity: "پلتفرم فروش طلا",
    amount: 2_000_000_000,
    startDate: "1404/07/17",
    duration: "سه ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۴٫۵٪ بر پایه طلا",
    image: coverImage("p004"),
    slug: "p004",
    status: "listed",
  },
  {
    id: "p005",
    title: "همیار مکانیک کوشا",
    activity: "تولیدکننده پله‌رو گردشی و هوم‌لیفت",
    amount: 1_500_000_000,
    startDate: "1404/06/17",
    duration: "۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۵٪",
    image: coverImage("p005"),
    slug: "p005",
    status: "listed",
  },
  {
    id: "p006",
    title: "موج پردازان فجر صنعت",
    activity: "تولیدکننده فاصله‌یاب رادار",
    amount: 3_000_000_000,
    startDate: "1404/06/27",
    duration: "۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۵٪",
    image: coverImage("p006"),
    slug: "p006",
    status: "listed",
  },
  {
    id: "p007",
    title: "روشانو",
    activity: "تولیدکننده تجهیزات و ارائه‌کننده خدمات مربوط به خانه‌بازی",
    amount: 5_000_000_000,
    startDate: "1404/08/12",
    duration: "۸ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۵۰٪",
    image: coverImage("p007"),
    slug: "p007",
    status: "listed",
  },
  {
    id: "p008",
    title: "آویتا",
    activity: "تولیدکننده ویلچر کربن",
    amount: 2_000_000_000,
    startDate: "1404/07/10",
    duration: "۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۵٪",
    image: coverImage("p008"),
    slug: "p008",
    status: "listed",
  },
  {
    id: "p009",
    title: "غرفه خانبار در خانبار",
    activity: "فروشنده خشکبار در باسلام",
    amount: 700_000_000,
    startDate: "1404/09/15",
    duration: "۵ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۷٫۵٪",
    image: coverImage("p009"),
    slug: "p009",
    status: "listed",
  },
  {
    id: "p010",
    title: "غرفه خانبار در باسلام",
    activity: "فروشنده خشکبار در باسلام",
    amount: 1_600_000_000,
    startDate: "1404/09/25",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۳۳٪",
    image: coverImage("p010"),
    slug: "p010",
    status: "listed",
  },
  {
    id: "p011",
    title: "همیار مکانیک کوشا",
    activity: "تولیدکننده پله‌رو گردشی و هوم‌لیفت",
    amount: 2_000_000_000,
    startDate: "1404/09/26",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۳۰٪",
    image: coverImage("p011"),
    slug: "p011",
    status: "listed",
  },
  {
    id: "p012",
    title: "روشانو",
    activity: "تولیدکننده تجهیزات و ارائه‌کننده خدمات مربوط به خانه‌بازی",
    amount: 4_000_000_000,
    startDate: "1404/10/21",
    duration: "۱۲ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۶۶٪",
    image: coverImage("p012"),
    slug: "p012",
    status: "listed",
  },
  {
    id: "p013",
    title: "نماموتور",
    activity: "تولیدکننده انواع موتورهای الکتریکی",
    amount: 4_000_000_000,
    startDate: "1404/11/05",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۱۲٪ بر پایه دلار",
    image: coverImage("p013"),
    slug: "p013",
    status: "listed",
  },
  {
    id: "p014",
    title: "روشن",
    activity: "ارائه خدمات در حوزه هوش مصنوعی",
    amount: 400_000_000,
    startDate: "1404/11/30",
    duration: "۴ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۴٪",
    image: coverImage("p014"),
    slug: "p014",
    status: "listed",
  },
  {
    id: "p015",
    title: "فاتح اسکن",
    activity: "تولیدکننده ایکس‌ری",
    amount: 4_000_000_000,
    startDate: "1404/12/11",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۱۲٪ بر پایه دلار",
    image: coverImage("p015"),
    slug: "p015",
    status: "listed",
  },
  {
    id: "p016",
    title: "همیار مکانیک کوشا",
    activity: "تولیدکننده پله‌رو گردشی و هوم‌لیفت",
    amount: 7_000_000_000,
    startDate: "1405/01/10",
    duration: "سه ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۱۸٪",
    image: coverImage("p016"),
    slug: "p016",
    status: "listed",
  },
  {
    id: "p017",
    title: "موج پردازان فجر صنعت",
    activity: "تولیدکننده فاصله‌یاب رادار",
    amount: 2_500_000_000,
    startDate: "1405/01/17",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۳۶٪",
    image: coverImage("p017"),
    slug: "p017",
    status: "listed",
  },
  {
    id: "p018",
    title: "موج پردازان فجر صنعت",
    activity: "تولیدکننده فاصله‌یاب رادار",
    amount: 4_500_000_000,
    startDate: "1405/01/17",
    duration: "۴ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۲۴٪",
    image: coverImage("p018"),
    slug: "p018",
    status: "listed",
  },
  {
    id: "p019",
    title: "غرفه نوگل در باسلام",
    activity: "فروشنده لباس نوزاد در باسلام",
    amount: 500_000_000,
    startDate: "1405/02/12",
    duration: "۶ ماهه",
    predictedReturn: "بازده پیش‌بینی‌شده ۳۰٪",
    image: coverImage("p019"),
    slug: "p019",
    status: "listed",
  },
];

/**
 * Newest startDate first.
 * Same date → higher id first (e.g. p018 before p017).
 */
export function getPublicProjectsSorted(): PublicProject[] {
  return [...PUBLIC_PROJECTS].sort((a, b) => {
    const byDate = b.startDate.localeCompare(a.startDate);
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
}

/** Newest-first slice for homepage featured strip. */
export function getFeaturedPublicProjects(limit = 3): PublicProject[] {
  return getPublicProjectsSorted().slice(0, limit);
}

export function getPublicProjectBySlug(
  slug: string,
): PublicProject | undefined {
  return PUBLIC_PROJECTS.find((p) => p.slug === slug || p.id === slug);
}

export function getPublicProjectById(id: string): PublicProject | undefined {
  return PUBLIC_PROJECTS.find((p) => p.id === id);
}

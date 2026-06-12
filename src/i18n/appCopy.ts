import type { Achievement, SubjectId } from "../data/arData";
import type { AppLanguage } from "../settings/AppSettingsContext";

const subjectCopy = {
  biology: {
    en: {
      name: "Natural Science",
      tagline: "Cells, organs and ecosystems",
      lessonCount: "18 lessons",
    },
    ar: {
      name: "العلوم الطبيعية",
      tagline: "الخلايا والأعضاء والأنظمة البيئية",
      lessonCount: "18 درسًا",
    },
    fr: {
      name: "Sciences naturelles",
      tagline: "Cellules, organes et écosystèmes",
      lessonCount: "18 leçons",
    },
  },
  physics: {
    en: {
      name: "Physics",
      tagline: "Motion, light and forces",
      lessonCount: "14 lessons",
    },
    ar: {
      name: "الفيزياء",
      tagline: "الحركة والضوء والقوى",
      lessonCount: "14 درسًا",
    },
    fr: {
      name: "Physique",
      tagline: "Mouvement, lumière et forces",
      lessonCount: "14 leçons",
    },
  },
  history: {
    en: {
      name: "History",
      tagline: "Civilizations and timelines",
      lessonCount: "12 lessons",
    },
    ar: {
      name: "التاريخ",
      tagline: "الحضارات والخطوط الزمنية",
      lessonCount: "12 درسًا",
    },
    fr: {
      name: "Histoire",
      tagline: "Civilisations et frises chronologiques",
      lessonCount: "12 leçons",
    },
  },
  geography: {
    en: {
      name: "Geography",
      tagline: "Maps, climate and terrain",
      lessonCount: "16 lessons",
    },
    ar: {
      name: "الجغرافيا",
      tagline: "الخرائط والمناخ والتضاريس",
      lessonCount: "16 درسًا",
    },
    fr: {
      name: "Géographie",
      tagline: "Cartes, climat et relief",
      lessonCount: "16 leçons",
    },
  },
} satisfies Record<
  SubjectId,
  Record<AppLanguage, { name: string; tagline: string; lessonCount: string }>
>;

const experienceCopy: Record<
  string,
  Record<
    AppLanguage,
    {
      title: string;
      shortDescription: string;
      teaser: string;
      focusTitle: string;
      focusCopy: string;
      duration: string;
    }
  >
> = {
  "human-heart": {
    en: {
      title: "Human Heart",
      shortDescription:
        "Inspect chambers, vessels and blood flow with guided labels.",
      teaser: "Step inside the cardiovascular system with a glowing 3D heart.",
      focusTitle: "Aorta",
      focusCopy:
        "Trace oxygen-rich blood leaving the left ventricle and see why the aorta is the body's main highway.",
      duration: "8 min lesson",
    },
    ar: {
      title: "قلب الإنسان",
      shortDescription:
        "استكشف الحجرات والأوعية وتدفق الدم مع تسميات إرشادية.",
      teaser: "ادخل إلى الجهاز القلبي الوعائي مع قلب ثلاثي الأبعاد متوهج.",
      focusTitle: "الشريان الأبهر",
      focusCopy:
        "تتبّع الدم الغني بالأكسجين وهو يغادر البطين الأيسر واكتشف لماذا يُعد الشريان الأبهر الطريق الرئيسي في الجسم.",
      duration: "درس 8 دقائق",
    },
    fr: {
      title: "Cœur humain",
      shortDescription:
        "Observez les cavités, les vaisseaux et la circulation du sang avec des repères guidés.",
      teaser:
        "Entrez dans le système cardiovasculaire avec un cœur 3D lumineux.",
      focusTitle: "Aorte",
      focusCopy:
        "Suivez le sang riche en oxygène qui quitte le ventricule gauche et voyez pourquoi l'aorte est l'artère principale du corps.",
      duration: "Leçon de 8 min",
    },
  },
  "human-lung": {
    en: {
      title: "Human Lung",
      shortDescription:
        "Explore lobes, bronchi and airflow pathways with guided anatomy labels.",
      teaser: "Open a detailed lung model and follow how every breath moves.",
      focusTitle: "Bronchi",
      focusCopy:
        "Track how the trachea branches into the lungs and carries air toward smaller breathing passages.",
      duration: "7 min lesson",
    },
    ar: {
      title: "رئة الإنسان",
      shortDescription:
        "استكشف الفصوص والشعب الهوائية ومسارات التنفس مع تسميات تشريحية إرشادية.",
      teaser: "افتح نموذجًا مفصلًا للرئة وتابع كيف يتحرك كل نفس داخلها.",
      focusTitle: "الشعب الهوائية",
      focusCopy:
        "تتبّع كيف تنقسم القصبة الهوائية داخل الرئتين وتنقل الهواء إلى المسارات التنفسية الأصغر.",
      duration: "درس 7 دقائق",
    },
    fr: {
      title: "Poumon humain",
      shortDescription:
        "Explorez les lobes, les bronches et les voies respiratoires avec des repères anatomiques guidés.",
      teaser:
        "Ouvrez un modèle détaillé du poumon et suivez le trajet de chaque respiration.",
      focusTitle: "Bronches",
      focusCopy:
        "Voyez comment la trachée se divise dans les poumons et conduit l'air vers des voies respiratoires plus fines.",
      duration: "Leçon de 7 min",
    },
  },
  "digestive-system": {
    en: {
      title: "Digestive System",
      shortDescription:
        "Scan a QR code to place the full digestive system and explore its main structures with guided notes.",
      teaser:
        "Follow the full digestive pathway in AR and tap numbered labels to understand each major structure.",
      focusTitle: "Digestive System",
      focusCopy:
        "This model presents the digestive system as a complete pathway, from food entry to nutrient absorption and waste processing.",
      duration: "9 min lesson",
    },
    ar: {
      title: "الجهاز الهضمي",
      shortDescription:
        "امسح رمز QR لعرض الجهاز الهضمي في الواقع المعزز واستكشف الأعضاء بملاحظات إرشادية.",
      teaser:
        "تتبع مسار الهضم في الواقع المعزز واضغط على الأرقام لفهم كل عضو.",
      focusTitle: "الأمعاء الدقيقة",
      focusCopy:
        "يحدث معظم امتصاص المغذيات في الأمعاء الدقيقة بعد أن يفكك المعدة الطعام.",
      duration: "درس 9 دقائق",
    },
    fr: {
      title: "Système digestif",
      shortDescription:
        "Scannez un QR code pour placer le système digestif complet et explorer ses principales structures avec des notes guidées.",
      teaser:
        "Suivez tout le trajet digestif en RA et touchez les numéros pour comprendre chaque structure importante.",
      focusTitle: "Système digestif",
      focusCopy:
        "Ce modèle présente le système digestif comme un parcours complet, de l'entrée des aliments à l'absorption des nutriments et au traitement des déchets.",
      duration: "Leçon de 9 min",
    },
  },
  "human-skin": {
    en: {
      title: "Human Skin",
      shortDescription:
        "Explore the layers of the skin and the structures that protect, sense and regulate the body.",
      teaser:
        "Zoom into a skin cross-section in AR and tap each numbered label to inspect its anatomy.",
      focusTitle: "Dermis",
      focusCopy:
        "The dermis supports the outer surface of the skin and contains follicles, glands, vessels and sensory structures.",
      duration: "8 min lesson",
    },
    ar: {
      title: "جلد الإنسان",
      shortDescription:
        "استكشف طبقات الجلد والبنى التي تحمي الجسم وتساعده على الإحساس وتنظيم الحرارة.",
      teaser:
        "كبّر مقطعًا عرضيًا للجلد في الواقع المعزز واضغط على كل تسمية لفحص التشريح.",
      focusTitle: "الأدمة",
      focusCopy:
        "تدعم الأدمة الطبقة الخارجية للجلد وتحتوي على الجريبات والغدد والأوعية والبنى الحسية.",
      duration: "درس 8 دقائق",
    },
    fr: {
      title: "Peau humaine",
      shortDescription:
        "Explorez les couches de la peau et les structures qui protègent, ressentent et régulent le corps.",
      teaser:
        "Zoomez dans une coupe de peau en RA et touchez chaque numéro pour examiner son anatomie.",
      focusTitle: "Derme",
      focusCopy:
        "Le derme soutient la surface externe de la peau et contient des follicules, des glandes, des vaisseaux et des structures sensorielles.",
      duration: "Leçon de 8 min",
    },
  },
  "female-reproductive-system": {
    en: {
      title: "Female Reproductive System",
      shortDescription:
        "Place a cross-section of the female reproductive system and explore the main organs with guided notes.",
      teaser:
        "Study the uterus, ovaries and connecting pathways in a clear AR cross-section.",
      focusTitle: "Uterus",
      focusCopy:
        "The uterus is the central muscular organ of the reproductive system and supports pregnancy when a fertilized egg implants.",
      duration: "9 min lesson",
    },
    ar: {
      title: "الجهاز التناسلي الأنثوي",
      shortDescription:
        "ضع مقطعًا للجهاز التناسلي الأنثوي واستكشف الأعضاء الرئيسية مع ملاحظات إرشادية.",
      teaser:
        "ادرس الرحم والمبايض والمسارات المتصلة من خلال مقطع واضح في الواقع المعزز.",
      focusTitle: "الرحم",
      focusCopy:
        "الرحم هو العضو العضلي المركزي في الجهاز التناسلي ويدعم الحمل عند انغراس البويضة المخصبة.",
      duration: "درس 9 دقائق",
    },
    fr: {
      title: "Système reproducteur féminin",
      shortDescription:
        "Placez une coupe du système reproducteur féminin et explorez les principaux organes avec des notes guidées.",
      teaser:
        "Étudiez l'utérus, les ovaires et les voies associées dans une coupe RA claire.",
      focusTitle: "Utérus",
      focusCopy:
        "L'utérus est l'organe musculaire central du système reproducteur et permet la grossesse lorsqu'un ovule fécondé s'implante.",
      duration: "Leçon de 9 min",
    },
  },
  "human-kidney": {
    en: {
      title: "Human Kidney",
      shortDescription:
        "Inspect the kidney layers and vessels that filter blood and guide urine out of the organ.",
      teaser:
        "Tap through the cortex, medulla and ureter in a detailed AR kidney model.",
      focusTitle: "Renal Cortex",
      focusCopy:
        "The renal cortex is the outer region where filtration begins before fluid continues deeper into the kidney.",
      duration: "8 min lesson",
    },
    ar: {
      title: "كلية الإنسان",
      shortDescription:
        "افحص طبقات الكلية والأوعية التي ترشح الدم وتوجه البول إلى خارج العضو.",
      teaser:
        "تنقل بين القشرة واللب والحالب داخل نموذج كلية مفصل في الواقع المعزز.",
      focusTitle: "القشرة الكلوية",
      focusCopy:
        "القشرة الكلوية هي المنطقة الخارجية التي تبدأ فيها عملية الترشيح قبل أن يتجه السائل إلى عمق الكلية.",
      duration: "درس 8 دقائق",
    },
    fr: {
      title: "Rein humain",
      shortDescription:
        "Examinez les couches du rein et les vaisseaux qui filtrent le sang et dirigent l'urine hors de l'organe.",
      teaser:
        "Parcourez le cortex, la médulla et l'uretère dans un modèle rénal détaillé en RA.",
      focusTitle: "Cortex rénal",
      focusCopy:
        "Le cortex rénal est la région externe où la filtration commence avant que le liquide ne poursuive son chemin plus profondément dans le rein.",
      duration: "Leçon de 8 min",
    },
  },
  "solar-system-model": {
    en: {
      title: "Solar System Model",
      shortDescription:
        "Orbit around planets, compare scale and explore gravitational paths.",
      teaser: "Shrink the solar system onto your desk and navigate every orbit.",
      focusTitle: "Orbital Paths",
      focusCopy:
        "Watch planets sweep around the sun and compare how distance changes their speed across the model.",
      duration: "11 min lesson",
    },
    ar: {
      title: "نموذج النظام الشمسي",
      shortDescription:
        "تحرّك حول الكواكب وقارن الأحجام واستكشف المسارات الجاذبية.",
      teaser: "ضع النظام الشمسي على مكتبك واستكشف كل مدار.",
      focusTitle: "المسارات المدارية",
      focusCopy:
        "شاهد الكواكب وهي تدور حول الشمس وقارن كيف تغيّر المسافة سرعتها داخل النموذج.",
      duration: "درس 11 دقيقة",
    },
    fr: {
      title: "Modèle du système solaire",
      shortDescription:
        "Tournez autour des planètes, comparez les tailles et explorez les trajectoires gravitationnelles.",
      teaser:
        "Réduisez le système solaire sur votre bureau et parcourez chaque orbite.",
      focusTitle: "Trajectoires orbitales",
      focusCopy:
        "Observez les planètes tourner autour du Soleil et comparez comment la distance influence leur vitesse dans le modèle.",
      duration: "Leçon de 11 min",
    },
  },
  "electric-circuit": {
    en: {
      title: "Electric Circuit",
      shortDescription:
        "Explore a battery, wires, switch and bulb in a simple closed circuit.",
      teaser: "Place a classroom circuit on your desk and follow the current path.",
      focusTitle: "Closed Circuit",
      focusCopy:
        "See how current flows only when every component is connected in one complete loop.",
      duration: "6 min lesson",
    },
    ar: {
      title: "الدائرة الكهربائية",
      shortDescription:
        "استكشف بطارية وأسلاكًا ومفتاحًا ومصباحًا داخل دائرة كهربائية مغلقة بسيطة.",
      teaser: "ضع دائرة كهربائية مدرسية على مكتبك وتابع مسار التيار.",
      focusTitle: "دائرة مغلقة",
      focusCopy:
        "لاحظ كيف يمر التيار فقط عندما تكون كل المكونات متصلة في حلقة كاملة.",
      duration: "درس 6 دقائق",
    },
    fr: {
      title: "Circuit électrique",
      shortDescription:
        "Explorez une pile, des fils, un interrupteur et une ampoule dans un circuit fermé simple.",
      teaser:
        "Placez un circuit de classe sur votre bureau et suivez le trajet du courant.",
      focusTitle: "Circuit fermé",
      focusCopy:
        "Voyez comment le courant circule seulement lorsque tous les composants sont reliés dans une boucle complète.",
      duration: "Leçon de 6 min",
    },
  },
  "magnetic-fields": {
    en: {
      title: "Magnetic Fields",
      shortDescription:
        "Reveal magnetic lines, polarity and field strength around a live core.",
      teaser: "Turn invisible field lines into an interactive glowing structure.",
      focusTitle: "Flux Density",
      focusCopy:
        "See how field lines tighten near the poles and spread wider as magnetic force becomes weaker.",
      duration: "9 min lesson",
    },
    ar: {
      title: "الحقول المغناطيسية",
      shortDescription:
        "اكشف خطوط المجال والقطبية وشدة المجال حول نواة نشطة.",
      teaser: "حوّل خطوط المجال غير المرئية إلى بنية تفاعلية متوهجة.",
      focusTitle: "كثافة الفيض",
      focusCopy:
        "لاحظ كيف تتقارب خطوط المجال قرب الأقطاب وتتباعد كلما ضعفت القوة المغناطيسية.",
      duration: "درس 9 دقائق",
    },
    fr: {
      title: "Champs magnétiques",
      shortDescription:
        "Révélez les lignes magnétiques, la polarité et l'intensité du champ autour d'un noyau actif.",
      teaser:
        "Transformez des lignes de champ invisibles en structure lumineuse et interactive.",
      focusTitle: "Densité de flux",
      focusCopy:
        "Voyez comment les lignes de champ se resserrent près des pôles et s'écartent lorsque la force magnétique faiblit.",
      duration: "Leçon de 9 min",
    },
  },
  "simple-pendulum": {
    en: {
      title: "Simple Pendulum",
      shortDescription:
        "Experiment with amplitude, period and gravity using a responsive model.",
      teaser: "Pull, release and observe how rhythm changes with length and force.",
      focusTitle: "Restoring Force",
      focusCopy:
        "Follow the swing arc and understand how gravity keeps pulling the bob back toward equilibrium.",
      duration: "7 min lesson",
    },
    ar: {
      title: "البندول البسيط",
      shortDescription:
        "جرّب السعة والزمن الدوري والجاذبية باستخدام نموذج تفاعلي.",
      teaser: "اسحب ثم اترك ولاحظ كيف يتغير الإيقاع مع الطول والقوة.",
      focusTitle: "قوة الإرجاع",
      focusCopy:
        "تابع مسار التأرجح وافهم كيف تعيد الجاذبية الجسم إلى موضع الاتزان.",
      duration: "درس 7 دقائق",
    },
    fr: {
      title: "Pendule simple",
      shortDescription:
        "Expérimentez l'amplitude, la période et la gravité avec un modèle réactif.",
      teaser:
        "Tirez, relâchez et observez comment le rythme change avec la longueur et la force.",
      focusTitle: "Force de rappel",
      focusCopy:
        "Suivez l'arc de balancement et comprenez comment la gravité ramène la masse vers l'équilibre.",
      duration: "Leçon de 7 min",
    },
  },
  "ancient-civilizations": {
    en: {
      title: "Castle of Consuegra",
      shortDescription:
        "Explore a medieval Spanish castle and its defensive architecture in AR.",
      teaser:
        "Place the Castle of Consuegra on your desk and inspect its fortress design.",
      focusTitle: "Main Keep",
      focusCopy:
        "Study how the keep, walls, towers and gate helped protect the fortress and control movement.",
      duration: "10 min lesson",
    },
    ar: {
      title: "الحضارات القديمة",
      shortDescription:
        "تجوّل بين المعابد والأدوات والقصص من الإمبراطوريات الأولى بالواقع المعزز.",
      teaser: "أحضر موقعًا أثريًا مصغرًا إلى الصف أو المنزل.",
      focusTitle: "تصميم المعبد",
      focusCopy:
        "استكشف كيف رتبت المساحات الاحتفالية والأعمدة والقطع الأثرية لتوجيه الحركة والطقوس.",
      duration: "درس 10 دقائق",
    },
    fr: {
      title: "Château de Consuegra",
      shortDescription:
        "Explorez un château médiéval espagnol et son architecture défensive en RA.",
      teaser:
        "Placez le château de Consuegra sur votre bureau et observez l'organisation de sa forteresse.",
      focusTitle: "Donjon principal",
      focusCopy:
        "Étudiez comment le donjon, les murs, les tours et la porte protégeaient la forteresse et contrôlaient les déplacements.",
      duration: "Leçon de 10 min",
    },
  },
  "tectonic-plates": {
    en: {
      title: "Tectonic Plates",
      shortDescription:
        "Peel back the crust and observe boundaries, uplift and subduction.",
      teaser: "Transform flat maps into a layered model of Earth's shifting shell.",
      focusTitle: "Convergent Edge",
      focusCopy:
        "Watch one plate press under another and discover how mountains, trenches and earthquakes begin.",
      duration: "9 min lesson",
    },
    ar: {
      title: "الصفائح التكتونية",
      shortDescription:
        "اكشف القشرة ولاحظ الحدود والارتفاع والانغراز.",
      teaser: "حوّل الخرائط المسطحة إلى نموذج طبقي لقشرة الأرض المتحركة.",
      focusTitle: "الحافة التقاربية",
      focusCopy:
        "شاهد صفيحة تنزلق أسفل أخرى واكتشف كيف تبدأ الجبال والخنادق والزلازل.",
      duration: "درس 9 دقائق",
    },
    fr: {
      title: "Plaques tectoniques",
      shortDescription:
        "Soulevez la croûte et observez les limites, le soulèvement et la subduction.",
      teaser:
        "Transformez des cartes plates en modèle stratifié de l'enveloppe mobile de la Terre.",
      focusTitle: "Limite convergente",
      focusCopy:
        "Observez une plaque passer sous une autre et découvrez comment naissent montagnes, fosses et séismes.",
      duration: "Leçon de 9 min",
    },
  },
  volcano: {
    en: {
      title: "Volcano",
      shortDescription:
        "Scan the QR code to place a volcano model and explore the crater, vent, magma chamber and lava flow.",
      teaser:
        "Launch the volcano in AR and inspect how eruptions move magma from underground to the surface.",
      focusTitle: "Magma Chamber",
      focusCopy:
        "The magma chamber stores molten rock beneath the volcano before pressure pushes it upward through the main vent.",
      duration: "8 min lesson",
    },
    ar: {
      title: "البركان",
      shortDescription:
        "امسح رمز QR لوضع نموذج بركان واستكشاف الفوهة والقناة وغرفة الصهارة وتدفق الحمم.",
      teaser:
        "شغّل البركان في الواقع المعزز وافحص كيف تتحرك الثورانات الصهارة من باطن الأرض إلى السطح.",
      focusTitle: "غرفة الصهارة",
      focusCopy:
        "تخزن غرفة الصهارة الصخور المنصهرة تحت البركان قبل أن يدفعها الضغط صعودا عبر القناة الرئيسية.",
      duration: "درس 8 دقائق",
    },
    fr: {
      title: "Volcan",
      shortDescription:
        "Scannez le QR code pour placer un volcan et explorer le cratère, la cheminée, la chambre magmatique et la coulée de lave.",
      teaser:
        "Lancez le volcan en RA et observez comment les éruptions déplacent le magma du sous-sol vers la surface.",
      focusTitle: "Chambre magmatique",
      focusCopy:
        "La chambre magmatique stocke la roche en fusion sous le volcan avant que la pression ne la pousse vers le haut par la cheminée principale.",
      duration: "Leçon de 8 min",
    },
  },
};

const badgeCopy: Record<string, Record<AppLanguage, string>> = {
  explorer: { en: "Explorer", ar: "المستكشف", fr: "Explorateur" },
  atom: { en: "Atom Ace", ar: "خبير الذرة", fr: "As de l'atome" },
  bio: { en: "Bio Lab", ar: "مختبر العلوم الطبيعية", fr: "Labo bio" },
  champion: { en: "Champion", ar: "البطل", fr: "Champion" },
  legend: { en: "Time Keeper", ar: "حارس الزمن", fr: "Gardien du temps" },
};

const progressStatusCopy: Record<string, Record<AppLanguage, string>> = {
  "Level unlocked": {
    en: "Level unlocked",
    ar: "تم فتح المستوى",
    fr: "Niveau débloqué",
  },
  "Map review pending": {
    en: "Map review pending",
    ar: "مراجعة الخريطة قيد الانتظار",
    fr: "Révision de la carte en attente",
  },
  "Timeline unlocked": {
    en: "Timeline unlocked",
    ar: "تم فتح الخط الزمني",
    fr: "Frise débloquée",
  },
  "Start your first lesson": {
    en: "Start your first lesson",
    ar: "ابدأ أول درس لك",
    fr: "Commencez votre première leçon",
  },
  "Lesson in progress": {
    en: "Lesson in progress",
    ar: "الدرس قيد التقدم",
    fr: "Leçon en cours",
  },
  Mastered: {
    en: "Mastered",
    ar: "تم الإتقان",
    fr: "Maîtrisé",
  },
};

const staticAchievementCopy: Record<
  string,
  Record<AppLanguage, { title: string; description: string; time: string }>
> = {
  heart: {
    en: {
      title: "Human Heart completed",
      description: "You identified every major chamber in the anatomy lesson.",
      time: "Today",
    },
    ar: {
      title: "تم إكمال قلب الإنسان",
      description: "لقد حددت جميع الحجرات الرئيسية في درس التشريح.",
      time: "اليوم",
    },
    fr: {
      title: "Cœur humain terminé",
      description:
        "Vous avez identifié toutes les grandes cavités dans la leçon d'anatomie.",
      time: "Aujourd'hui",
    },
  },
  streak: {
    en: {
      title: "Seven-day learning streak",
      description: "You kept your AR practice alive for an entire week.",
      time: "Yesterday",
    },
    ar: {
      title: "سلسلة تعلم لمدة سبعة أيام",
      description: "حافظت على ممارسة الواقع المعزز لمدة أسبوع كامل.",
      time: "أمس",
    },
    fr: {
      title: "Série d'apprentissage de sept jours",
      description:
        "Vous avez maintenu votre pratique en réalité augmentée pendant toute une semaine.",
      time: "Hier",
    },
  },
  badge: {
    en: {
      title: "Field Scientist badge earned",
      description: "Geography exploration now unlocks terrain overlays.",
      time: "April 6",
    },
    ar: {
      title: "تم الحصول على شارة عالم ميداني",
      description: "أصبح استكشاف الجغرافيا يفتح الآن طبقات التضاريس.",
      time: "6 أبريل",
    },
    fr: {
      title: "Badge de scientifique de terrain obtenu",
      description:
        "L'exploration en géographie débloque maintenant les couches de relief.",
      time: "6 avril",
    },
  },
};

export const getLocale = (language: AppLanguage) => {
  if (language === "ar") {
    return "ar";
  }

  if (language === "fr") {
    return "fr-FR";
  }

  return "en-US";
};

export const getSubjectCopy = (subjectId: SubjectId, language: AppLanguage) =>
  subjectCopy[subjectId][language];

export const getExperienceCopy = (
  experienceId: string,
  language: AppLanguage,
) => experienceCopy[experienceId]?.[language];

export const getBadgeLabel = (badgeId: string, language: AppLanguage) =>
  badgeCopy[badgeId]?.[language] ?? badgeId;

export const getProgressStatusLabel = (
  status: string,
  language: AppLanguage,
) => progressStatusCopy[status]?.[language] ?? status;

const formatDateLabel = (rawValue: string, language: AppLanguage) => {
  if (rawValue === "Today") {
    if (language === "ar") {
      return "اليوم";
    }

    if (language === "fr") {
      return "Aujourd'hui";
    }

    return rawValue;
  }

  if (rawValue === "Yesterday") {
    if (language === "ar") {
      return "أمس";
    }

    if (language === "fr") {
      return "Hier";
    }

    return rawValue;
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawValue;
  }

  return new Intl.DateTimeFormat(getLocale(language), {
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

export const getAchievementCopy = (
  achievement: Achievement,
  language: AppLanguage,
) => {
  const staticCopy = staticAchievementCopy[achievement.id]?.[language];

  if (staticCopy) {
    return staticCopy;
  }

  if (achievement.id === "account-created") {
    const firstName = achievement.description.split(",")[0] ?? "";

    if (language === "ar") {
      return {
        title: "تم إنشاء الحساب",
        description: `${firstName}، ملفك في EduAR جاهز لأول درس.`,
        time: formatDateLabel(achievement.time, language),
      };
    }

    if (language === "fr") {
      return {
        title: "Compte créé",
        description:
          achievement.description ||
          `${firstName}, votre profil EduAR est prêt pour sa première leçon.`,
        time: formatDateLabel(achievement.time, language),
      };
    }

    return {
      title: "Account created",
      description:
        achievement.description ||
        `${firstName}, your EduAR profile is ready for its first lesson.`,
      time: formatDateLabel(achievement.time, language),
    };
  }

  if (achievement.id.startsWith("launch-")) {
    const experienceId = achievement.id.replace("launch-", "");
    const localizedExperience = getExperienceCopy(experienceId, language);

    if (localizedExperience) {
      if (language === "ar") {
        return {
          title: `تم استكشاف ${localizedExperience.title}`,
          description:
            "لقد أحرزت تقدمًا جديدًا بفتح هذا الدرس في الواقع المعزز.",
          time: formatDateLabel(achievement.time, language),
        };
      }

      if (language === "fr") {
        return {
          title: `${localizedExperience.title} exploré`,
          description:
            "Vous avez progressé en ouvrant cette leçon en réalité augmentée.",
          time: formatDateLabel(achievement.time, language),
        };
      }

      return {
        title: `${localizedExperience.title} explored`,
        description: "You added fresh progress by opening this AR lesson.",
        time: formatDateLabel(achievement.time, language),
      };
    }
  }

  return {
    title: achievement.title,
    description: achievement.description,
    time: formatDateLabel(achievement.time, language),
  };
};

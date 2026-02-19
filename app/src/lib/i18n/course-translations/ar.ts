import type { CourseTranslationMap } from "./types";

const arCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "اساسيات سولانا",
    description: "مقدمة بمستوى انتاج للمبتدئين الذين يريدون نماذج ذهنية واضحة في سولانا، وقدرات اقوى في تتبع اخطاء المعاملات، وسير عمل حتمي لادارة المحافظ.",
  },
  "anchor-development": {
    title: "تطوير Anchor",
    description: "دورة مبنية على المشاريع للانتقال من الاساسيات الى هندسة Anchor الواقعية: نمذجة حسابات حتمية، بناء التعليمات، انضباط الاختبار، وتجربة عميل موثوقة.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor الاساسيات",
        "description": "Anchor architecture, حساب constraints, و PDA foundations مع explicit ownership of الامان-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor النموذج الذهني",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "حسابات, constraints, و safety",
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
          },
          "anchor-counter-init-deterministic": {
            "title": "Initialize Counter PDA (deterministic)",
          },
        },
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, حسابات, و الاختبار",
        "description": "Deterministic تعليمة builders, stable state emulation, و الاختبار strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment تعليمة builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "الاختبار strategy without flakiness",
          },
          "anchor-client-composition-and-ux": {
            "title": "Client composition & UX",
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
          },
        },
      },
    },
  },
  "solana-frontend": {
    title: "تطوير الواجهة الامامية لسولانا",
    description: "دورة مبنية على المشاريع لمهندسي الواجهة الامامية لبناء لوحات سولانا جاهزة للانتاج: مخفضات حتمية، مسارات احداث قابلة لاعادة التشغيل، وتجربة معاملات موثوقة.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "اساسيات الواجهة الامامية لسولانا",
        description: "نمذجة صحيحة لحالة المحفظة/الحسابات، وتصميم UX لدورة حياة المعاملة، وفرض قواعد حتمية لتصحيح اخطاء قابل لاعادة التشغيل.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "حالة المحفظة + النموذج الذهني للحسابات لمطوري الواجهة",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "دورة حياة المعاملة في UI: قيد الانتظار/مؤكدة/نهائية وواجهة متفائلة",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "صحة البيانات: ازالة التكرار، الترتيب، idempotency، واحداث التصحيح",
          },
          "frontend-v2-core-reducer": {
            title: "بناء نموذج الحالة الاساسي + reducer من الاحداث",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "مشروع لوحة التوكن",
        description: "بناء reducer ولقطات replay ومقاييس الاستعلام ومخرجات لوحة حتمية تظل مستقرة تحت البيانات الجزئية او المتاخرة.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "تنفيذ محاكي تدفق الاحداث + خط زمني replay + لقطات",
          },
          "frontend-v2-query-layer-metrics": {
            title: "تنفيذ طبقة الاستعلام + المقاييس المحسوبة",
          },
          "frontend-v2-production-ux-hardening": {
            title: "UX انتاجي: التخزين المؤقت، الترقيم، لافتات الاخطاء، skeletons، حدود المعدل",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "اصدار لوحة التحكمSummary مستقر من fixtures",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "التمويل اللامركزي على سولانا",
    description: "دورة متقدمة مبنية على المشاريع للمهندسين الذين يبنون انظمة المبادلة: تخطيط حتمي دون اتصال على نمط Jupiter، ترتيب المسارات، امان minOut، وتشخيصات قابلة لاعادة الانتاج.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "اساسيات المبادلة",
        description: "فهم رياضيات CPMM وبنية الاقتباس ومفاضلات التوجيه الحتمي مع وسائل حماية المستخدم ذات الاولوية الامنية.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "اساسيات AMM على سولانا: المجمعات والرسوم والانزلاق واثر السعر",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "بنية الاقتباس: in/out والرسوم و minOut والتنفيذ في اسوا الاحوال",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "التوجيه: لماذا قد يتفوق مسار hopين على hop واحد",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "مشروع مخطط مبادلة بنمط Jupiter (Offline)",
        description: "بناء اقتباس حتمي واختيار المسار وفحوصات امان minOut ثم انتاج مخرجات نقطة التحقق مستقرة لمراجعات قابلة لاعادة الانتاج.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "تنفيذ نموذج token/pool + حساب اقتباس المنتج الثابت",
          },
          "defi-v2-router-best": {
            title: "تنفيذ تعداد المسارات واختيار افضل مسار",
          },
          "defi-v2-safety-minout": {
            title: "تنفيذ slippage/minOut وتفصيل الرسوم وثوابت الامان",
          },
          "defi-v2-production-swap-ux": {
            title: "تجربة مبادلة انتاجية: اقتباسات القديمة وحماية ومحاكاة",
          },
          "defi-v2-checkpoint": {
            title: "انتاج نقطة التحقق مستقر لـ المبادلةPlan + المبادلةSummary",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "امان وتدقيق سولانا",
    description: "مختبر حتمي للثغرات لمدققي سولانا الذين يحتاجون ادلة استغلال قابلة للتكرار، وتوجيهات اصلاح دقيقة، ومخرجات تدقيق عالية الاشارة.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "نموذج التهديد ومنهج التدقيق",
        description: "نمذجة تهديدات تتمحور حول الحسابات، واعادة انتاج حتمية للاستغلال، وانضباط ادلة يضمن نتائج تدقيق موثوقة.",
        lessons: {
          "security-v2-threat-model": {
            title: "نموذج تهديد سولانا للمدققين: accounts و المالكون و الموقعون و قابلة للكتابة و PDAs",
          },
          "security-v2-evidence-chain": {
            title: "سلسلة الادلة: اعادة انتاج، تتبع، اثر، اصلاح، تحقق",
          },
          "security-v2-bug-classes": {
            title: "فئات الاخطاء الشائعة في سولانا وطرق التخفيف",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "مسار مشروع مختبر الثغرات",
        description: "استغلال ثم اصلاح ثم تحقق مع انتاج مخرجات جاهزة للتدقيق باستخدام traces حتمية واستنتاجات مدعومة بالـ invariants.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Break it: استغلال غياب فحوص الموقع + المالك",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Break it: استغلال عدم تطابق PDA spoof",
          },
          "security-v2-patch-validate": {
            title: "Fix it: تحقق من الاصلاح + مجموعة invariants",
          },
          "security-v2-writing-reports": {
            title: "كتابة تقارير التدقيق: الشدة، الاحتمال، نطاق الاثر، والمعالجة",
          },
          "security-v2-audit-report-checkpoint": {
            title: "نقطة تحقق: AuditReport JSON + markdown حتمي",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "هندسة التوكن على سولانا",
    description: "دورة مبنية على المشاريع للفرق التي تطلق توكنات سولانا حقيقية: تخطيط حتمي لـ Token-2022، تصميم الصلاحيات، محاكاة المعروض، وانضباط تشغيلي لعمليات الاطلاق.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "اساسيات التوكن -> Token-2022",
        description: "افهم بدائيات التوكن، وبنية سياسات mint، وضوابط امتدادات Token-2022 ضمن اطار واضح للحوكمة ونموذج التهديد.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "توكنات SPL مقابل Token-2022: ما الذي تغيره الامتدادات",
          },
          "token-v2-mint-anatomy": {
            title: "بنية mint: الصلاحيات، والكسور العشرية، والمعروض، والتجميد، والسك",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "مزالق امان الامتدادات: اعدادات الرسوم، اساءة المفوَّض، والحالة الافتراضية للحساب",
          },
          "token-v2-validate-config-derive": {
            title: "التحقق من اعدادات التوكن + اشتقاق عناوين حتمية دون اتصال",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "مشروع حزمة اطلاق التوكن",
        description: "ابن تدفقات حتمية للتحقق والتخطيط والمحاكاة تنتج مخرجات اطلاق قابلة للمراجعة ومعايير استمرار/توقف واضحة.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "بناء خطة تعليمات تهيئة Token-2022",
          },
          "token-v2-simulate-fees-supply": {
            title: "بناء رياضيات mint-to + transfer-fee + المحاكاة",
          },
          "token-v2-launch-checklist": {
            title: "قائمة اطلاق: المعلمات، واستراتيجية upgrade/authority، وخطة airdrop/الاختبار",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "اخراج LaunchPackSummary ثابت",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "تطوير تطبيقات الموبايل على سولانا",
    description: "ابن تطبيقات dApp للموبايل على سولانا جاهزة للانتاج باستخدام MWA، وبنية قوية لجلسات المحفظة، وتجربة توقيع واضحة، وعمليات توزيع منضبطة.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "محمول Wallet Adapter",
        description: "اساسيات بروتوكول MWA، والتحكم بدورة حياة الجلسة، وانماط handoff مرنة مع المحفظة لتطبيقات الموبايل بمستوى انتاج.",
        lessons: {
          "mobile-wallet-overview": {
            title: "نظرة عامة على محفظة الموبايل",
          },
          "mwa-integration": {
            title: "تكامل MWA",
          },
          "mobile-transaction": {
            title: "بناء دالة معاملة للموبايل",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store والتوزيع",
        description: "النشر، والجاهزية التشغيلية، وممارسات UX للموبايل المرتكزة على الثقة لتوزيع تطبيقات سولانا.",
        lessons: {
          "dapp-store-submission": {
            title: "تقديم التطبيق الى dApp Store",
          },
          "mobile-best-practices": {
            title: "افضل ممارسات الموبايل",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "اختبار برامج سولانا",
    description: "ابن انظمة اختبار قوية لبرامج سولانا عبر البيئات المحلية والمحاكاة والشبكة مع ثوابت امان صريحة وبوابات ثقة بجودة اصدار.",
    modules: {
      "module-testing-foundations": {
        title: "اساسيات الاختبار",
        description: "استراتيجية اختبار اساسية عبر طبقات unit/integration مع تدفقات حتمية وتغطية حالات هجومية.",
        lessons: {
          "testing-approaches": {
            title: "مناهج الاختبار",
          },
          "bankrun-testing": {
            title: "اختبار Bankrun",
          },
          "write-bankrun-test": {
            title: "كتابة اختبار Bankrun لبرنامج Counter",
          },
        },
      },
      "module-advanced-testing": {
        title: "اختبار متقدم",
        description: "Fuzzing، والتحقق على devnet، وضوابط اصدار CI/CD لتغييرات بروتوكول اكثر امانا.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing باستخدام Trident",
          },
          "devnet-testing": {
            title: "اختبار Devnet",
          },
          "ci-cd-pipeline": {
            title: "مسار CI/CD لسولانا",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "فهرسة وتحليلات سولانا",
    description: "ابن مفهرس احداث لسولانا بمستوى انتاج مع فك ترميز حتمي، وعقود ادخال مرنة، واستعادة عبر نقاط التحقق، ومخرجات تحليلات يمكن الوثوق بها.",
    modules: {
      "indexing-v2-foundations": {
        title: "اساسيات الفهرسة",
        description: "نموذج الاحداث، وفك ترميز حسابات token، وتحليل بيانات المعاملة الوصفية لبناء خطوط فهرسة موثوقة.",
        lessons: {
          "indexing-v2-events-model": {
            title: "نموذج الاحداث: المعاملات والسجلات وتعليمات البرنامج",
          },
          "indexing-v2-token-decoding": {
            title: "فك ترميز حسابات token وبنية SPL",
          },
          "indexing-v2-decode-token-account": {
            title: "تحدي: فك ترميز حساب token + فرق ارصدة token",
          },
          "indexing-v2-transaction-meta": {
            title: "تحليل بيانات المعاملة الوصفية: السجلات والاخطاء والتعليمات الداخلية",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "خط الفهرسة والتحليلات",
        description: "تطبيع المعاملات، والترقيم/نقطة تحقق، واستراتيجيات cache، وتجميع تحليلات قابل لاعادة الانتاج.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "تحدي: فهرسة المعاملات الى احداث موحدة",
          },
          "indexing-v2-pagination-caching": {
            title: "الترقيم، نقطة تحقق، ودلالات التخزين المؤقت",
          },
          "indexing-v2-analytics": {
            title: "تجميع التحليلات: مقاييس لكل محفظة ولكل token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "نقطة تحقق: انتاج ملخص تحليلي JSON ثابت",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "المدفوعات وتدفقات الدفع في سولانا",
    description: "ابن تدفقات مدفوعات سولانا بمستوى انتاج مع تحقق قوي، و idempotency امن ضد اعادة التشغيل، و webhooks امنة، وايصالات حتمية للمطابقة.",
    modules: {
      "payments-v2-foundations": {
        title: "اساسيات المدفوعات",
        description: "التحقق من العناوين، واستراتيجية idempotency، وتصميم payment intent لسلوك checkout موثوق.",
        lessons: {
          "payments-v2-address-validation": {
            title: "التحقق من العنوان واستراتيجيات memo",
          },
          "payments-v2-idempotency": {
            title: "مفاتيح idempotency والحماية من replay",
          },
          "payments-v2-payment-intent": {
            title: "تحدي: انشاء payment intent مع التحقق",
          },
          "payments-v2-tx-building": {
            title: "بناء المعاملة وبيانات المفتاح الوصفية",
          },
        },
      },
      "payments-v2-implementation": {
        title: "التنفيذ والتحقق",
        description: "بناء المعاملة، والتحقق من اصالة webhook، وتوليد ايصال حتمي مع معالجة واضحة لحالات الخطا.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "تحدي: بناء معاملة تحويل",
          },
          "payments-v2-webhooks": {
            title: "توقيع webhooks والتحقق منها",
          },
          "payments-v2-error-states": {
            title: "الة حالات الخطا وتنسيق الايصال",
          },
          "payments-v2-webhook-receipt": {
            title: "تحدي: التحقق من webhook وانتاج ايصال",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "اساسيات NFT و cNFT",
    description: "اتقن هندسة NFT المضغوط على سولانا: التزامات Merkle، وانظمة الاثبات، ونمذجة المجموعات، وفحوصات امان بمستوى انتاج.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "اساسيات Merkle",
        description: "بناء الشجرة، وهاش الاوراق، والية الادراج، ونموذج الالتزام on-chain/off-chain وراء الاصول المضغوطة.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "اشجار Merkle لضغط الحالة",
          },
          "cnft-v2-leaf-hashing": {
            title: "قواعد هاش الورقة وmetadata",
          },
          "cnft-v2-merkle-insert": {
            title: "تحدي: تنفيذ ادراج Merkle + تحديثات root",
          },
          "cnft-v2-proof-generation": {
            title: "توليد الاثبات وحساب المسار",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "نظام الاثبات والامان",
        description: "توليد والتحقق من الاثبات، وسلامة المجموعات، وتعزيز الامان ضد replay وspoof للـ metadata.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "تحدي: تنفيذ توليد الاثبات + المدقق",
          },
          "cnft-v2-collection-minting": {
            title: "سك المجموعات ومحاكاة metadata",
          },
          "cnft-v2-attack-surface": {
            title: "سطح الهجوم: اثباتات غير صالحة وreplay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "نقطة تحقق: محاكاة mint + التحقق من اثبات الملكية",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "الحوكمة وعمليات خزينة متعدد التوقيع",
    description: "ابن انظمة حوكمة DAO وخزينة متعدد التوقيع جاهزة للانتاج مع احتساب تصويت حتمي، وامان timelock، وضوابط تنفيذ امنة.",
    modules: {
      "governance-v2-governance": {
        title: "حوكمة DAO",
        description: "دورة حياة المقترحات، واليات التصويت الحتمية، وسياسة quorum، وامان timelock لحوكمة DAO موثوقة.",
        lessons: {
          "governance-v2-dao-model": {
            title: "نموذج DAO: المقترحات والتصويت والتنفيذ",
          },
          "governance-v2-quorum-math": {
            title: "رياضيات quorum وحساب وزن التصويت",
          },
          "governance-v2-timelocks": {
            title: "حالات timelock وجدولة التنفيذ",
          },
          "governance-v2-quorum-voting": {
            title: "تحدي: تنفيذ الة حالات quorum/التصويت",
          },
        },
      },
      "governance-v2-multisig": {
        title: "خزينة متعدد التوقيع",
        description: "بناء معاملات متعدد التوقيع، وضوابط الموافقة، ودفاعات اعادة التشغيل، وانماط تنفيذ خزينة امنة.",
        lessons: {
          "governance-v2-multisig": {
            title: "بناء معاملات متعدد التوقيع والموافقات",
          },
          "governance-v2-multisig-builder": {
            title: "تحدي: تنفيذ منشئ tx متعدد التوقيع + قواعد الموافقة",
          },
          "governance-v2-safe-defaults": {
            title: "اعدادات امنة افتراضيا: فحوص المالك وحراس اعادة التشغيل",
          },
          "governance-v2-treasury-execution": {
            title: "تحدي: تنفيذ مقترح وانتاج فرق الخزينة",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "اداء سولانا وتحسين Compute",
    description: "اتقن هندسة الاداء في سولانا عبر مسارات تحسين قابلة للقياس: ميزانيات compute، وتخطيطات البيانات، وكفاءة الترميز، ونمذجة تكاليف حتمية.",
    modules: {
      "performance-v2-foundations": {
        title: "اساسيات الاداء",
        description: "نموذج compute، وقرارات تخطيط الحساب/البيانات، وتقدير تكلفة حتمي لتحليل الاداء على مستوى المعاملة.",
        lessons: {
          "performance-v2-compute-model": {
            title: "نموذج compute: الميزانيات، التكاليف، والحدود",
          },
          "performance-v2-account-layout": {
            title: "تصميم تخطيط الحساب وتكلفة التسلسل",
          },
          "performance-v2-cost-model": {
            title: "تحدي: تنفيذ نموذج estimateCost(op)",
          },
          "performance-v2-instruction-data": {
            title: "حجم بيانات التعليمة وتحسين الترميز",
          },
        },
      },
      "performance-v2-optimization": {
        title: "التحسين والتحليل",
        description: "تحسين التخطيط، وضبط ميزانية الحوسبة، وتحليل اداء before/after مع ضمانات صحة التنفيذ.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "تحدي: تنفيذ layout/codec محسّن",
          },
          "performance-v2-compute-budget": {
            title: "اساسيات تعليمات ميزانية الحوسبة",
          },
          "performance-v2-micro-optimizations": {
            title: "تحسينات دقيقة ومفاضلات",
          },
          "performance-v2-perf-checkpoint": {
            title: "نقطة تحقق: مقارنة before/after + اخراج تقرير اداء",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "تجميع مبادلات DeFi",
    description: "اتقن تجميع المبادلات في سولانا بمستوى انتاج: تحليل quote بشكل حتمي، ومفاضلات تحسين المسارات، وامان الانزلاق السعري، وتنفيذ واع بالموثوقية.",
    modules: {
      "swap-v2-fundamentals": {
        title: "اساسيات المبادلة",
        description: "اليات مبادلة التوكن، وحماية الانزلاق السعري، وتركيب المسارات، وبناء مبادلةPlan بشكل حتمي مع مفاضلات واضحة.",
        lessons: {
          "swap-v2-mental-model": {
            title: "النموذج الذهني للمبادلة: mints وATAs والكسور العشرية والمسارات",
          },
          "swap-v2-slippage": {
            title: "الانزلاق السعري واثر السعر: حماية نتائج المبادلة",
          },
          "swap-v2-route-explorer": {
            title: "تصور المسار: فهم اجزاء المبادلة والرسوم",
          },
          "swap-v2-swap-plan": {
            title: "تحدي: بناء مبادلةPlan موحد من quote",
          },
        },
      },
      "swap-v2-execution": {
        title: "التنفيذ والموثوقية",
        description: "تنفيذ عبر الة حالات، وتشريح المعاملة، وانماط موثوقية retry/staleness، وتقارير تنفيذ مبادلة عالية الاشارة.",
        lessons: {
          "swap-v2-state-machine": {
            title: "تحدي: تنفيذ الة حالات UI للمبادلة",
          },
          "swap-v2-tx-anatomy": {
            title: "بنية معاملة المبادلة: التعليمات، الحسابات، وcompute",
          },
          "swap-v2-reliability": {
            title: "انماط الموثوقية: retries، وquotes القديمة، والكمون",
          },
          "swap-v2-swap-report": {
            title: "نقطة تحقق: توليد مبادلةRunتقرير",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "هندسة سيولة CLMM",
    description: "اتقن هندسة السيولة المركزة على منصات Solana DEX: رياضيات tick، وتصميم استراتيجية النطاق، وديناميكيات الرسوم وIL، وتقارير حتمية لمراكز LP.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "اساسيات CLMM",
        description: "مفاهيم السيولة المركزة، ورياضيات tick/السعر، وسلوك مراكز النطاق لفهم تنفيذ CLMM بشكل صحيح.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM مقابل المنتج الثابت: لماذا توجد ticks",
          },
          "clmm-v2-price-tick": {
            title: "السعر و tick و sqrtPrice: التحويلات الاساسية",
          },
          "clmm-v2-range-explorer": {
            title: "مراكز النطاق: ديناميكيات in-range و out-of-range",
          },
          "clmm-v2-tick-math": {
            title: "تحدي: تنفيذ دوال مساعدة لتحويل tick/السعر",
          },
        },
      },
      "clmm-v2-positions": {
        title: "المراكز والمخاطر",
        description: "محاكاة تراكم الرسوم، ومفاضلات استراتيجيات النطاق، ومخاطر الدقة، وتقارير حتمية لمخاطر المراكز.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "تحدي: محاكاة تراكم رسوم المركز",
          },
          "clmm-v2-range-strategy": {
            title: "استراتيجيات النطاق: ضيق، واسع، وقواعد اعادة التوازن",
          },
          "clmm-v2-risk-review": {
            title: "مخاطر CLMM: التقريب، overflow، واخطاء tick spacing",
          },
          "clmm-v2-position-report": {
            title: "نقطة تحقق: انشاء تقرير مركز",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "مخاطر الاقراض والتصفية",
    description: "اتقن هندسة مخاطر الاقراض في سولانا: اليات الاستفادة والفائدة، وتحليل مسارات التصفية، وامان الاوراكل، وتقارير سيناريو حتمية.",
    modules: {
      "lending-v2-fundamentals": {
        title: "اساسيات الاقراض",
        description: "اليات مجمعات الاقراض، ونماذج الفائدة المعتمدة على الاستفادة، واسس health factor اللازمة لتحليل مخاطر قابل للدفاع.",
        lessons: {
          "lending-v2-pool-model": {
            title: "نموذج مجمع الاقراض: supply و borrow والاستفادة",
          },
          "lending-v2-interest-curves": {
            title: "منحنيات الفائدة ونموذج kink",
          },
          "lending-v2-health-explorer": {
            title: "مراقبة health factor ومعاينة التصفية",
          },
          "lending-v2-interest-rates": {
            title: "تحدي: حساب معدلات الفائدة المعتمدة على الاستفادة",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "ادارة المخاطر",
        description: "حساب health factor، واليات التصفية، والتعامل مع اعطال الاوراكل، وتقارير مخاطر متعددة السيناريو للاسواق المجهدة.",
        lessons: {
          "lending-v2-health-factor": {
            title: "تحدي: حساب health factor وحالة التصفية",
          },
          "lending-v2-liquidation-mechanics": {
            title: "اليات التصفية: bonus و close factor والديون المعدومة",
          },
          "lending-v2-oracle-risk": {
            title: "مخاطر الاوراكل والاسعار القديمة في الاقراض",
          },
          "lending-v2-risk-report": {
            title: "نقطة تحقق: انشاء تقرير مخاطر متعدد السيناريو",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "لوحة مخاطر العقود الدائمة",
    description: "اتقن هندسة مخاطر دائم على سولانا: محاسبة دقيقة لـ PnL والتمويل، ومراقبة امان الهامش، ومحاكاة التصفية، وتقارير حتمية عبر الكونسول.",
    modules: {
      "perps-v2-fundamentals": {
        title: "اساسيات العقود الدائمة",
        description: "اليات العقود الدائمة، ومنطق تراكم التمويل، واسس نمذجة PnL للحصول على تشخيصات دقيقة للمراكز.",
        lessons: {
          "perps-v2-mental-model": {
            title: "العقود الدائمة: المراكز الاساسية، سعر الدخول، وسعر mark مقابل oracle",
          },
          "perps-v2-funding": {
            title: "معدلات التمويل: لماذا توجد وكيف تتراكم",
          },
          "perps-v2-pnl-explorer": {
            title: "تصور PnL: تتبع الربح عبر الزمن",
          },
          "perps-v2-pnl-calc": {
            title: "تحدي: حساب PnL للعقود الدائمة",
          },
          "perps-v2-funding-accrual": {
            title: "تحدي: محاكاة تراكم معدل التمويل",
          },
        },
      },
      "perps-v2-risk": {
        title: "المخاطر والمراقبة",
        description: "مراقبة الهامش والتصفية، واخطاء التنفيذ الشائعة، ومخرجات لوحة مخاطر حتمية لدعم قابلية الرصد في بيئات الانتاج.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "نسبة الهامش وحدود التصفية",
          },
          "perps-v2-common-bugs": {
            title: "اخطاء شائعة: اخطاء الاشارة، الوحدات، واتجاه التمويل",
          },
          "perps-v2-risk-console-report": {
            title: "نقطة تحقق: انشاء تقرير لوحة المخاطر",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "محسن معاملات DeFi",
    description: "اتقن تحسين معاملات DeFi على سولانا: ضبط compute والرسوم، واستراتيجية ALT، وانماط الموثوقية، وتخطيط حتمي لاستراتيجية الارسال.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "اساسيات المعاملات",
        description: "تشخيص فشل المعاملات، واليات ميزانية الحوسبة، واستراتيجية priority fee، واساسيات تقدير الرسوم.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "لماذا تفشل معاملات DeFi: حدود CU، الحجم، وانتهاء blockhash",
          },
          "txopt-v2-compute-budget": {
            title: "تعليمات ميزانية الحوسبة واستراتيجية priority fee",
          },
          "txopt-v2-cost-explorer": {
            title: "تقدير تكلفة المعاملة وتخطيط الرسوم",
          },
          "txopt-v2-tx-plan": {
            title: "تحدي: بناء خطة معاملة مع ميزانية الحوسبةing",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "التحسين والاستراتيجية",
        description: "تخطيط Address Lookup Table، وانماط الموثوقية/retry، وتجربة اخطاء قابلة للتنفيذ، وتقارير كاملة لاستراتيجية الارسال.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "تحدي: تخطيط استخدام Address Lookup Table",
          },
          "txopt-v2-reliability": {
            title: "انماط الموثوقية: retry، وre-quote، وresend مقابل reبناء",
          },
          "txopt-v2-ux-errors": {
            title: "UX: رسائل اخطاء قابلة للتنفيذ لفشل المعاملات",
          },
          "txopt-v2-send-strategy": {
            title: "نقطة تحقق: توليد تقرير استراتيجية الارسال",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "التوقيع على الموبايل في سولانا",
    description: "اتقن توقيع المحافظ على الموبايل بمستوى انتاج في سولانا: جلسات Android MWA، وقيود deep link في iOS، واعادة المحاولة المرنة، وقياس حتمي للجلسات.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "اساسيات التوقيع على الموبايل",
        description: "قيود المنصات، وانماط UX للاتصال، وسلوك timeline لجلسة التوقيع، وبناء requests Typed عبر Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "فحص واقعي للتوقيع على الموبايل: قيود Android مقابل iOS",
          },
          "mobilesign-v2-connection-ux": {
            title: "انماط UX لاتصال المحفظة: connect وreconnect وrecovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "الجدول الزمني لجلسة التوقيع: تدفق request والمحفظة والاستجابة",
          },
          "mobilesign-v2-sign-request": {
            title: "تحدي: بناء sign request Typed",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "انماط الانتاج",
        description: "استمرارية الجلسة، وامان شاشات مراجعة المعاملة، والات حالات retry، وتقارير حتمية للجلسات لتطبيقات الموبايل الانتاجية.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "تحدي: حفظ الجلسة واستعادتها",
          },
          "mobilesign-v2-review-screens": {
            title: "مراجعة معاملة الموبايل: ما الذي يجب ان يراه المستخدمون",
          },
          "mobilesign-v2-retry-patterns": {
            title: "اعادة محاولة بنقرة واحدة: معالجة حالات offline وrejected وtimeout",
          },
          "mobilesign-v2-session-report": {
            title: "نقطة تحقق: توليد تقرير جلسة",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "تجارة Solana Pay",
    description: "اتقن تكامل Solana Pay للتجارة: ترميز URL قوي، وتدفقات تتبع QR/الدفع، وتجربة تاكيد واضحة، ومخرجات POS حتمية للمطابقة.",
    modules: {
      "solanapay-v2-foundations": {
        title: "اساسيات Solana Pay",
        description: "مواصفة Solana Pay، والانضباط في ترميز URL، وبنية طلبات التحويل، وانماط بناءer/encoder الحتمية.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "النموذج الذهني لـ Solana Pay وقواعد ترميز URL",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "بنية طلب التحويل: recipient و amount و reference و labels",
          },
          "solanapay-v2-url-explorer": {
            title: "منشئ URL: معاينة مباشرة لعناوين Solana Pay",
          },
          "solanapay-v2-encode-transfer": {
            title: "تحدي: ترميز عنوان URL لطلب تحويل Solana Pay",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "التتبع والتجارة",
        description: "الات حالة لتتبع reference، وتجربة تاكيد الدفع، ومعالجة الاعطال، وتوليد ايصالات POS بشكل حتمي.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "تحدي: تتبع مراجع الدفع عبر حالات التاكيد",
          },
          "solanapay-v2-confirmation-ux": {
            title: "تجربة التاكيد: حالات pending و confirmed و expired",
          },
          "solanapay-v2-error-handling": {
            title: "معالجة الاخطاء والحالات الطرفية في تدفقات الدفع",
          },
          "solanapay-v2-pos-receipt": {
            title: "نقطة تحقق: توليد ايصال POS",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "هندسة تجربة محفظة المستخدم",
    description: "اتقن هندسة تجربة المحفظة في سولانا بمستوى انتاج: حالة اتصال حتمية، وامان شبكة، ومرونة RPC، وانماط موثوقية قابلة للقياس.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "اساسيات الاتصال",
        description: "تصميم اتصال المحفظة، وشبكة gating، وبنية الة حالات حتمية لمسارات onboarding واعادة الاتصال بشكل متوقع.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "تجربة اتصال لا تفشل: قائمة فحص للتصميم",
          },
          "walletux-v2-network-gating": {
            title: "بوابة الشبكة والتعافي من الشبكة الخاطئة",
          },
          "walletux-v2-state-explorer": {
            title: "الة حالات الاتصال: الحالات والاحداث والانتقالات",
          },
          "walletux-v2-connection-state": {
            title: "تحدي: تنفيذ الة حالات اتصال المحفظة",
          },
        },
      },
      "walletux-v2-production": {
        title: "انماط الانتاج",
        description: "ابطال cache، ومرونة RPC ومراقبة صحته، وتقارير قابلة للقياس لجودة UX للمحفظة في التشغيل الانتاجي.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "تحدي: ابطال cache عند احداث المحفظة",
          },
          "walletux-v2-rpc-caching": {
            title: "قراءات RPC واستراتيجية cache لتطبيقات المحفظة",
          },
          "walletux-v2-rpc-health": {
            title: "مراقبة صحة RPC والتدهور السلس",
          },
          "walletux-v2-ux-report": {
            title: "نقطة تحقق: توليد محفظة UX تقرير",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "اتقن مصادقة SIWS بمستوى انتاج في سولانا: مدخلات موحدة، وثوابت تحقق صارمة، ودورة حياة nonce مقاومة لاعادة التشغيل، وتقارير جاهزة للتدقيق.",
    modules: {
      "siws-v2-fundamentals": {
        title: "اساسيات SIWS",
        description: "سبب وجود SIWS، ودلالات حقول الادخال الصارمة، وسلوك عرض المحافظ، وبناء مدخلات sign-in بشكل حتمي.",
        lessons: {
          "siws-v2-why-exists": {
            title: "لماذا يوجد SIWS: استبدال connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "حقول ادخال SIWS وقواعد الامان",
          },
          "siws-v2-message-preview": {
            title: "معاينة الرسالة: كيف تعرض المحافظ طلبات SIWS",
          },
          "siws-v2-sign-in-input": {
            title: "تحدي: بناء SIWS sign-in input متحقق منه",
          },
        },
      },
      "siws-v2-verification": {
        title: "التحقق والامان",
        description: "ثوابت التحقق على الخادم، ودفاعات nonce ضد replay، وادارة الجلسات، وتقارير تدقيق مصادقة حتمية.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "تحدي: التحقق من استجابة SIWS sign-in",
          },
          "siws-v2-sessions": {
            title: "الجلسات وتسجيل الخروج: ما الذي نخزنه وما الذي لا نخزنه",
          },
          "siws-v2-replay-protection": {
            title: "الحماية من replay وتصميم سجل nonce",
          },
          "siws-v2-auth-report": {
            title: "نقطة تحقق: توليد تقرير تدقيق للمصادقة",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "الرسوم ذات الاولوية و ميزانية الحوسبة",
    description: "هندسة رسوم دفاعية في سولانا مع تخطيط compute حتمي، وسياسة اولوية تكيفية، وعقود موثوقية UX مرتبطة بالتاكيد.",
    modules: {
      "pfcb-v2-foundations": {
        title: "اساسيات الرسوم وCompute",
        description: "اليات الادراج، واقتران compute/fee، وتصميم سياسات موجه بالـ explorer مع اطار موثوقية حتمي.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "اسواق الرسوم في سولانا: ما الذي يحرك الادراج فعليا",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "اساسيات ميزانية الحوسبة وانماط الفشل الشائعة",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: من مدخلات مخطط ميزانية الحوسبة الى الخطة",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "تحدي: تنفيذ planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "رحلة مشروع Fee محسن",
        description: "تنفيذ مخططات حتمية، ومحركات سياسة التاكيد، ومخرجات مستقرة لاستراتيجية الرسوم لمراجعة الاصدار.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "تحدي: تنفيذ estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "تحدي: محرك قرار مستوى التاكيد",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "تحدي: بناء markdown لـ feePlanملخص",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "نقطة تحقق: تقرير Fee محسن",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "حزم و ذرية المعاملات",
    description: "صمم تدفقات سولانا دفاعية متعددة المعاملات مع تحقق حتمي من الذرية، ونمذجة للتعويض، وتقارير امان جاهزة للتدقيق.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "اساسيات الذرية",
        description: "نموذج الذرية، ومخاطر التدفقات متعددة المعاملات، والتحقق الدفاعي من الامان لحماية توقعات المستخدم.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "مفاهيم الذرية ولماذا يفترض المستخدمون مبدأ الكل او لا شيء",
          },
          "bundles-v2-flow-risk-points": {
            title: "تدفقات متعددة المعاملات: approvals، وانشاء ATA، وswaps، وrefunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: خطوات مخطط التدفق ونقاط المخاطر",
          },
          "bundles-v2-build-atomic-flow": {
            title: "تحدي: تنفيذ بناءAtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "مشروع محاكي تدفق Atomic Swap",
        description: "تنفيذ مدققات ذرية حتمية، وانماط معالجة الفشل، وتركيب حزم ثابت لمراجعة الاصدار.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "تحدي: تنفيذ validateالذرية()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "تحدي: معالجة الفشل باستخدام مفاتيح idempotency",
          },
          "bundles-v2-bundle-composer": {
            title: "تحدي: composer حتمي للـ حزم",
          },
          "bundles-v2-flow-safety-report": {
            title: "نقطة تحقق: تقرير امان التدفق",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "واقع ميمبول وتجربة Anti-Sandwich",
    description: "هندسة دفاعية لتجربة مبادلات المستخدم مع تصنيف مخاطر حتمي، وسياسات انزلاق سعري محدودة، وتواصل امان جاهز للحوادث.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "واقع ميمبول ودفاع UX",
        description: "مخاطر بين quote والتنفيذ، وحواجز slippage، وقرارات حداثة quote لبناء تدفقات swap اكثر امانا في الانتاج.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "ما الذي قد يخطئ بين quote والتنفيذ",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "ضوابط slippage والحواجز",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: مؤقت حداثة quote وجدول القرار",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "تحدي: تنفيذ evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "رحلة مشروع واجهة Swap محمية",
        description: "تنفيذ حراس slippage، ونماذج التأثير، وتكوينات حماية قابلة للتصدير مع مخرجات حتمية.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "تحدي: تنفيذ slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "تحدي: نمذجة اثر السعر مقابل slippage",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "تحدي: بناء swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "نقطة تحقق: تصدير اعدادات حماية swap",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "المفهرسات و Webhooks وخطوط Reorg-Safe",
    description: "ابن خطوط فهرسة حتمية بمستوى انتاج لادخال امن ضد التكرار، ومعالجة اعادة التنظيم، وتقارير تضع سلامة البيانات اولا.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "اساسيات موثوقية المفهرس",
        description: "اساسيات الفهرسة، وواقع reorg/التاكيد، ومراحل خط المعالجة لادخال قابل للتتبع وامن.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "الفهرسة 101: السجلات والحسابات وتحليل المعاملات",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "اعادة التنظيم واختيار fork: لماذا confirmed ليس finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: من ingest الى dedupe الى confirm الى apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "تحدي: تنفيذ dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "رحلة مشروع مفهرس Reorg-Safe",
        description: "تنفيذ منطق التاكيد، وتخطيط backfill/idempotency، وفحوص سلامة snapshot لاخراج تقارير خط معالجة مستقرة.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "تحدي: تنفيذ applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "تحدي: تخطيط backfill وidempotency",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "تحدي: فحوص سلامة snapshot",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "نقطة تحقق: تصدير تقرير خط معالجة",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "موثوقية RPC وهندسة الكمون",
    description: "صمم عملاء RPC متعدد المزودين في سولانا بمستوى انتاج مع سياسات حتمية لاعادة المحاولة، والتوجيه، والتخزين المؤقت، وقابلية الرصد.",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, و deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests و fallbacks",
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
          },
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
          },
        },
      },
      "rpc-v2-project-journey": {
        "title": "RPC Multi-Provider Client Project Journey",
        "description": "Build deterministic policy engines ل routing, retries, metrics reduction, و health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching و invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer و histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "بنية بيانات Rust واتقان Borsh",
    description: "هندسة بنية البيانات في سولانا باسلوب Rust-first مع ادوات حتمية على مستوى البايت، وممارسات مخطط امنة للتوافق.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, و عملي parsing safety ل stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, و why Solana حسابات care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct و enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer ل field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "حساب Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, و compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
          },
        },
      },
    },
  },
  "rust-errors-invariants": {
    title: "تصميم الاخطاء والثوابت في Rust",
    description: "ابن مكتبات حراسة ثوابت Typed مع مخرجات ادلة حتمية، وعقود اخطاء امنة للتوافق، وتقارير جاهزة للتدقيق.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error و Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, و deterministic invariant التصميم fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, و context",
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
          },
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
          },
        },
      },
      "rei-v2-project-journey": {
        "title": "Invariant Guard Library Project Journey",
        "description": "Implement guard helpers, evidence-chain generation, و stable audit reporting ل reliability و incident response.",
        "lessons": {
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
          },
          "rei-v2-invariant-audit-checkpoint": {
            "title": "Checkpoint: invariant audit report",
          },
        },
      },
    },
  },
  "rust-perf-onchain-thinking": {
    title: "اداء Rust لتفكير On-chain",
    description: "حاكي وحسن سلوك تكلفة compute باستخدام ادوات حتمية Rust-first وحوكمة اداء مدفوعة بالميزانية.",
    modules: {
      "rpot-v2-foundations": {
        "title": "الاداء Foundations",
        "description": "Rust الاداء النموذج الذهنيs, data-structure tradeoffs, و deterministic cost reasoning ل reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "الاداء النموذج الذهني: allocations, clones, hashing",
          },
          "rpot-v2-data-structure-tradeoffs": {
            "title": "Data structures: Vec, HashMap, BTreeMap tradeoffs",
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
          },
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
          },
        },
      },
      "rpot-v2-project-journey": {
        "title": "Compute Budget Profiler (Sim)",
        "description": "Build deterministic profilers, recommendation engines, و report outputs aligned to explicit الاداء budgets.",
        "lessons": {
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
          },
          "rpot-v2-suggest-optimizations": {
            "title": "Challenge: implement suggestOptimizations()",
          },
          "rpot-v2-perf-report-checkpoint": {
            "title": "Checkpoint: stable perf report",
          },
        },
      },
    },
  },
  "rust-async-indexer-pipeline": {
    title: "التزامن و غير متزامن للمفهرسات (Rust)",
    description: "هندسة خطوط غير متزامن باسلوب Rust-first مع تزامن محدود، و reducers امنة ضد replay، وتقارير تشغيلية حتمية.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, و deterministic execution modeling ل indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits و backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph و concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, و report exports ل reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
          },
        },
      },
    },
  },
  "rust-proc-macros-codegen-safety": {
    title: "الماكروز الاجرائية و توليد كود للامان",
    description: "تعلم امان الماكروز وتوليد الكود في Rust عبر ادوات parser حتمية وتوليد checks بمخرجات صديقة للتدقيق.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro و Codegen Foundations",
        "description": "Macro النموذج الذهنيs, constraint DSL التصميم, و safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro النموذج الذهني: declarative vs procedural",
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
          },
          "rpmcs-v2-constraint-builder-explorer": {
            "title": "Explorer: constraint builder to generated checks",
          },
        },
      },
      "rpmcs-v2-project-journey": {
        "title": "حساب Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, و publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
          },
          "rpmcs-v2-generate-checks": {
            "title": "Challenge: implement generateChecks()",
          },
          "rpmcs-v2-golden-tests": {
            "title": "Challenge: deterministic golden-file checks",
          },
          "rpmcs-v2-run-generated-checks": {
            "title": "Challenge: runGeneratedChecks()",
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
          },
        },
      },
    },
  },
  "anchor-upgrades-migrations": {
    title: "ترقيات Anchor وترحيل الحسابات",
    description: "صمم تدفقات اصدار امنة لانتاج Anchor مع تخطيط ترحيل حتمي، وبوابات ترقية، وادلة rollback، واثباتات جاهزية.",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, حساب versioning strategy, و deterministic upgrade risk modeling ل Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "حساب versioning و migration strategy",
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
          },
          "aum-v2-plan-migration-steps": {
            "title": "Challenge: implement migration step planner",
          },
        },
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, و deterministic readiness artifacts ل controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy و incident playbooks",
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
          },
        },
      },
    },
  },
  "solana-reliability": {
    title: "هندسة الموثوقية لسولانا",
    description: "هندسة موثوقية موجهة للانتاج لانظمة سولانا: تحمل الاعطال، retries، deadlines، circuit breakers، وتدهور سلس بنتائج تشغيلية قابلة للقياس.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks مع clear failure classification, retry boundaries, و deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
          },
        },
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, و rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
          },
        },
      },
    },
  },
  "solana-testing-strategies": {
    title: "استراتيجيات الاختبار لسولانا",
    description: "استراتيجية اختبار شاملة موجهة للانتاج في سولانا: اختبارات وحدات حتمية، اختبارات تكامل واقعية، fuzz/property اختبار، وتقارير ثقة للاصدار.",
    modules: {
      "mod-11-1": {
        "title": "Unit و Integration الاختبار",
        "description": "Build deterministic unit و integration الاختبار layers مع clear ownership of invariants, fixtures, و failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "الاختبار Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock حساب Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "متقدم الاختبار Techniques",
        "description": "Use fuzzing, property-based tests, و mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing و Property الاختبار",
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
          },
        },
      },
    },
  },
  "solana-program-optimization": {
    title: "تحسين برامج سولانا",
    description: "ابن اداء سولانا بمستوى انتاج: budgeting للـ compute، وكفاءة تخطيط الحسابات، ومفاضلات الذاكرة/rent، وتدفقات تحسين حتمية.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths مع explicit CU budgets, operation-level profiling, و predictable الاداء tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
          },
          "lesson-12-1-4": {
            "title": "Batch Operation Optimizer Challenge",
          },
        },
      },
      "mod-12-2": {
        "title": "Memory و Storage Optimization",
        "description": "التصميم memory/storage-efficient حساب layouts مع rent-aware sizing, serialization discipline, و safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "حساب Data Optimization",
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
          },
        },
      },
    },
  },
  "solana-tokenomics-design": {
    title: "تصميم اقتصاديات التوكن لسولانا",
    description: "صمم اقتصاديات توكن قوية في سولانا مع انضباط التوزيع، وامان vesting، وحوافز staking، واليات حوكمة قابلة للدفاع تشغيليا.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution و Vesting",
        "description": "Model token allocation و vesting systems مع explicit fairness, unlock predictability, و deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
          },
        },
      },
      "mod-13-2": {
        "title": "Staking و الحوكمة",
        "description": "التصميم staking و الحوكمة mechanics مع clear incentive alignment, anti-manipulation constraints, و measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking و الحوكمة التصميم",
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
          },
        },
      },
    },
  },
  "solana-defi-primitives": {
    title: "بدائيات DeFi على سولانا",
    description: "ابن اسس DeFi عملية على سولانا: اليات AMM، ومحاسبة السيولة، وبدائيات الاقراض، وانماط تركيب امنة ضد flash loans.",
    modules: {
      "mod-14-1": {
        "title": "AMM و Liquidity",
        "description": "Implement AMM و liquidity primitives مع deterministic math, slippage-aware outputs, و LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
          },
          "lesson-14-1-4": {
            "title": "Price Oracle Challenge",
          },
        },
      },
      "mod-14-2": {
        "title": "Lending و Flash Loans",
        "description": "Model lending و flash-loan flows مع collateral safety, utilization-aware pricing, و strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
          },
          "lesson-14-2-3": {
            "title": "Interest Rate Model Challenge",
          },
          "lesson-14-2-4": {
            "title": "Flash Loan مدقق Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "معايير NFT على سولانا",
    description: "نفذ NFTs على سولانا بمعايير جاهزة للانتاج: سلامة metadata، وانضباط المجموعات، وسلوكيات متقدمة قابلة للبرمجة/غير قابلة للنقل.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality مع standards-compliant metadata, collection verification, و deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
          },
          "lesson-15-1-4": {
            "title": "Attribute Rarity Calculator Challenge",
          },
        },
      },
      "mod-15-2": {
        "title": "متقدم NFT Features",
        "description": "Implement متقدم NFT behaviors (soulbound و programmable flows) مع explicit policy controls و safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound و Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token مدقق Challenge",
          },
          "lesson-15-2-3": {
            "title": "Dynamic NFT Updater Challenge",
          },
          "lesson-15-2-4": {
            "title": "NFT Composability Challenge",
          },
        },
      },
    },
  },
  "solana-cpi-patterns": {
    title: "انماط عبر البرامج Invocation (CPI)",
    description: "اتقن تركيب CPI على سولانا مع تحقق امن للحسابات، وانضباط توقيع PDA، وانماط حتمية لتنسيق متعدد البرامج.",
  },
  "solana-mev-strategies": {
    title: "MEV وترتيب المعاملات",
    description: "هندسة ترتيب معاملات موجهة للانتاج على سولانا: توجيه واع بـ MEV، واستراتيجية bundles، ونمذجة التصفية/التحكيم، وضوابط تنفيذ تحمي المستخدم.",
  },
  "solana-deployment-cicd": {
    title: "نشر البرامج و CI/CD",
    description: "هندسة نشر لبرامج سولانا بمستوى انتاج: استراتيجية البيئات، وبوابات الاصدار، وضوابط جودة CI/CD، وتدفقات تشغيل امنة للترقيات.",
  },
  "solana-cross-chain-bridges": {
    title: "الجسور عبر السلاسل و Wormhole",
    description: "ابن تكاملات عبر السلاسل اكثر امانا لسولانا باستخدام رسائل بنمط Wormhole، والتحقق من attestations، وضوابط حتمية لحالة الجسر.",
  },
  "solana-oracle-pyth": {
    title: "تكامل الاوراكل وشبكة Pyth",
    description: "ادمج تغذيات الاوراكل في سولانا بشكل امن: التحقق من السعر، وسياسة الثقة/القدم، وتجميع متعدد المصادر لاتخاذ قرارات بروتوكول اكثر مرونة.",
  },
  "solana-dao-tooling": {
    title: "ادوات DAO والمنظمات الذاتية",
    description: "ابن انظمة DAO جاهزة للانتاج على سولانا: حوكمة المقترحات، وسلامة التصويت، وضوابط الخزينة، وتدفقات تنفيذ/تقارير حتمية.",
  },
  "solana-gaming": {
    title: "الالعاب وادارة حالة اللعبة",
    description: "ابن انظمة العاب on-chain جاهزة للانتاج على سولانا: نماذج حالة فعالة، وسلامة الادوار، وضوابط العدالة، واقتصاديات تقدم لاعبين قابلة للتوسع.",
  },
  "solana-permanent-storage": {
    title: "التخزين الدائم و Arweave",
    description: "ادمج التخزين اللامركزي الدائم مع سولانا عبر تدفقات بنمط Arweave: عنونة المحتوى، وسلامة manifest، ووصول طويل الامد قابل للتحقق.",
  },
  "solana-staking-economics": {
    title: "الستيكينغ واقتصاديات المدققين",
    description: "افهم اقتصاديات الستيكينغ والمدققين في سولانا لاتخاذ قرارات عملية: استراتيجية التفويض، وديناميكيات المكافآت، واثر العمولات، والاستدامة التشغيلية.",
  },
  "solana-account-abstraction": {
    title: "تجريد الحسابات والمحافظ الذكية",
    description: "نفذ انماط المحافظ الذكية/تجريد الحسابات على سولانا مع تفويض قابل للبرمجة، وضوابط استرداد، والتحقق من المعاملات بشكل مدفوع بالسياسات.",
  },
  "solana-pda-mastery": {
    title: "اتقان Program Derived Address",
    description: "اتقن هندسة PDA المتقدمة على سولانا: تصميم مخطط seeds، وانضباط bump، والاستخدام الامن لـ PDA عبر البرامج على نطاق انتاج.",
  },
  "solana-economics": {
    title: "اقتصاديات سولانا وتدفقات التوكن",
    description: "حلل ديناميكيات اقتصاد سولانا في سياق الانتاج: تفاعل التضخم مع fee-burn، وتدفقات الستيكينغ، وحركة المعروض، ومفاضلات استدامة البروتوكول.",
  },
};

export const arCourseTranslations: CourseTranslationMap = arCuratedCourseTranslations;

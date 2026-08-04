export type AgentLocale = "en" | "ar";

export function getAgentReply(message: string, locale: AgentLocale) {
  const normalized = message.trim().toLowerCase();
  const isArabic = locale === "ar";

  if (
    normalized.includes("budget") ||
    normalized.includes("ميزانية") ||
    normalized.includes("cost") ||
    normalized.includes("تكلفة")
  ) {
    return isArabic
      ? "لتحقيق ميزانية منطقية، ابدأ بتقسيمها إلى فئات: المكان، الطعام، التصوير، الزينة، واللبس. عادةً ما يكون من المفيد تخصيص احتياطيٍ من 10% إلى 15% لأي تغييرات غير متوقعة."
      : "To build a realistic budget, break it into categories such as venue, catering, photography, décor, and attire. A practical buffer of 10% to 15% helps cover unexpected changes.";
  }

  if (
    normalized.includes("venue") ||
    normalized.includes("hall") ||
    normalized.includes("مكان") ||
    normalized.includes("قاعة")
  ) {
    return isArabic
      ? "عند اختيار المكان، راعِ السعة، الموقع، والتجهيزات. من الأفضل أن تتأكد من أن المكان يناسب أجواء الزفاف التي تريدها وأن يكون لديه مرونة في الجداول الزمنية."
      : "When choosing a venue, consider capacity, location, and amenities. It helps to confirm the atmosphere matches your wedding style and that the venue can flex with your schedule.";
  }

  if (
    normalized.includes("vendor") ||
    normalized.includes("مورد") ||
    normalized.includes("service") ||
    normalized.includes("خدمة")
  ) {
    return isArabic
      ? "ابدأ بتجميع قائمة مختصرة من 3 إلى 5 مزودين، ثم قارن بينهم من حيث السعر، والتقييمات، والمرونة. غالبًا ما تكون المقارنة المباشرة هي أسرع طريقة لاختيار الشريك المناسب."
      : "Start by shortlisting 3 to 5 vendors, then compare them on price, reviews, and flexibility. A direct comparison often makes it easier to choose the right partner.";
  }

  if (
    normalized.includes("timeline") ||
    normalized.includes("schedule") ||
    normalized.includes("جدول") ||
    normalized.includes("الجدول")
  ) {
    return isArabic
      ? "أول خطوة في الجدول هي تحديد اللحظات الأساسية: الحفل، الاستقبال، والتصوير. ثم أضف وقتًا كافيًا للانتقال بين الأنشطة وتوفير احتياطي بسيط على كل نشاط."
      : "A strong timeline starts with your anchor moments: ceremony, reception, and photography. Add enough transition time between activities and leave a small buffer for each block.";
  }

  return isArabic
    ? "أفهم أن لديك احتياجًا خاصًا. يمكنني مساعدتك في تنظيم ميزانيتك، اختيار المكان، أو ترتيب قائمة المزودين خطوة بخطوة."
    : "I can help you shape your wedding plan step by step, whether you need guidance on budgeting, venue choices, vendor selection, or your timeline.";
}

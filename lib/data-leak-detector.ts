export interface LeakWarning {
  type: string;
  label: string;
  advice: string;
}

const LEAK_PATTERNS: { type: string; label: string; pattern: RegExp; advice: string }[] = [
  {
    type: "card_number",
    label: "Номер карты",
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
    advice: "Никогда не сообщайте номер карты незнакомцам! Банк никогда не запрашивает полный номер карты по телефону.",
  },
  {
    type: "cvv",
    label: "CVV-код",
    pattern: /\b(?:cvv|свв|код)\s*:?\s*\d{3}\b/i,
    advice: "CVV-код — секретный код на обратной стороне карты. Его нельзя сообщать НИКОМУ, даже сотрудникам банка!",
  },
  {
    type: "cvv_standalone",
    label: "CVV-код",
    pattern: /(?:^|\s)\d{3}(?:\s|$)/,
    advice: "Похоже, вы отправили трёхзначный код. Если это CVV — никогда не сообщайте его!",
  },
  {
    type: "phone",
    label: "Номер телефона",
    pattern: /(?:\+375|80)\s*\(?\d{2}\)?\s*\d{3}[\s-]?\d{2}[\s-]?\d{2}/,
    advice: "Не сообщайте номер телефона незнакомцам — он может быть использован для мошенничества и восстановления доступа к вашим аккаунтам.",
  },
  {
    type: "sms_code",
    label: "Код из SMS",
    pattern: /\b(?:код|code)\s*:?\s*\d{4,6}\b/i,
    advice: "Код из SMS — это ключ к вашим деньгам и аккаунтам! Никогда не сообщайте его по телефону или в переписке.",
  },
  {
    type: "sms_code_digits",
    label: "Код из SMS",
    pattern: /(?:^|\s)\d{4,6}(?:\s|$)/,
    advice: "Вы отправили числовой код. Если это код из SMS — его нельзя сообщать никому!",
  },
  {
    type: "password",
    label: "Пароль",
    pattern: /(?:парол[ьей]|password|пасс)\s*:?\s*\S+/i,
    advice: "Пароль — это ваша защита! Ни один настоящий сервис никогда не попросит ваш пароль в переписке или по телефону.",
  },
  {
    type: "passport",
    label: "Паспортные данные",
    pattern: /(?:паспорт|серия|номер паспорта)\s*:?\s*[A-ZА-Я]{2}\s*\d{6,7}/i,
    advice: "Паспортные данные — конфиденциальная информация! Мошенники могут оформить кредит на ваше имя.",
  },
  {
    type: "address",
    label: "Домашний адрес",
    pattern: /(?:ул\.|улица|проспект|пр\.|пер\.|переулок|кв\.|квартира|д\.|дом)\s*\S+/i,
    advice: "Не сообщайте домашний адрес незнакомцам! Эта информация может быть использована для кражи или мошенничества.",
  },
  {
    type: "full_name",
    label: "ФИО",
    pattern: /(?:меня зовут|мое имя|фамилия|зовут)\s+[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/i,
    advice: "Полное имя вместе с другими данными может быть использовано для кражи личности.",
  },
  {
    type: "intercom_code",
    label: "Код домофона",
    pattern: /(?:код(?:\s+от)?\s*(?:домофон|подъезд|дверь))\s*:?\s*\S+/i,
    advice: "Код от домофона — это доступ к вашему дому! Не сообщайте его незнакомцам.",
  },
  {
    type: "home_schedule",
    label: "График отсутствия дома",
    pattern: /(?:никого нет|не бываю|ухожу|прихожу|на работе с|до)\s*(?:дома)?\s*(?:с|до|в)\s*\d/i,
    advice: "Информация о том, когда вас нет дома, может быть использована для ограбления!",
  },
  {
    type: "money_transfer",
    label: "Перевод денег",
    pattern: /(?:переведу|перевод|скину|отправлю|кину)\s*(?:на карту|деньги|денег|\d)/i,
    advice: "Не переводите деньги незнакомым людям! Даже если они представляются друзьями — сначала проверьте их личность другим способом.",
  },
];

export function detectLeaks(message: string): LeakWarning[] {
  const warnings: LeakWarning[] = [];
  const seenTypes = new Set<string>();

  for (const { type, label, pattern, advice } of LEAK_PATTERNS) {
    const baseType = type.replace(/_standalone$/, "").replace(/_digits$/, "");
    if (seenTypes.has(baseType)) continue;

    if (pattern.test(message)) {
      seenTypes.add(baseType);
      warnings.push({ type: baseType, label, advice });
    }
  }

  return warnings;
}

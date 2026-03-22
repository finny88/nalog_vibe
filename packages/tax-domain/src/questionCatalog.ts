export const SUPPORTED_APARTMENT_SALE_WIZARD_STEP_IDS = ['entry', 'taxpayer', 'apartment', 'acquisition', 'sale', 'cadastral-value', 'reduction-choice'] as const
export const SUPPORTED_APARTMENT_SALE_QUESTION_IDS = [
	'declaration-year',
	'residency-status',
	'property-type',
	'ownership-kind',
	'acquisition-method',
	'last-name',
	'first-name',
	'middle-name',
	'inn',
	'birth-date',
	'passport-series',
	'passport-number',
	'passport-issue-date',
	'passport-issuer-name',
	'passport-issuer-code',
	'registration-region',
	'registration-city',
	'registration-street',
	'registration-house',
	'cadastral-number',
	'apartment-address',
	'purchase-date',
	'ownership-registration-date',
	'purchase-price-rub',
	'documented-purchase-expenses-rub',
	'sale-date',
	'sale-price-rub',
	'cadastral-value-amount-rub',
	'reduction-method'
] as const

export type SupportedApartmentSaleWizardStepId = (typeof SUPPORTED_APARTMENT_SALE_WIZARD_STEP_IDS)[number]
export type SupportedApartmentSaleQuestionId = (typeof SUPPORTED_APARTMENT_SALE_QUESTION_IDS)[number]
export type SupportedApartmentSaleQuestionInputKind = 'date' | 'money' | 'radio' | 'text'
export type SupportedApartmentSaleQuestionValidationRule =
	| 'cadastral-number'
	| 'date'
	| 'inn'
	| 'money'
	| 'passport-issuer-code'
	| 'passport-number'
	| 'passport-series'
	| 'required'

export interface SupportedApartmentSaleQuestionChoice {
	value: string
	label: string
}

export interface SupportedApartmentSaleQuestionValidation {
	rule: SupportedApartmentSaleQuestionValidationRule
	message: string
}

export interface SupportedApartmentSaleWizardQuestion {
	id: SupportedApartmentSaleQuestionId
	step: SupportedApartmentSaleWizardStepId
	draftPath: string
	canonicalPath?: string
	inputKind: SupportedApartmentSaleQuestionInputKind
	label: string
	helpText: string
	whereToFind: string
	example: string
	placeholder?: string
	choices?: readonly SupportedApartmentSaleQuestionChoice[]
	validation: readonly SupportedApartmentSaleQuestionValidation[]
}

export interface SupportedApartmentSaleWizardStep {
	id: SupportedApartmentSaleWizardStepId
	title: string
	description: string
}

const requiredValidation = (message: string): SupportedApartmentSaleQuestionValidation => ({ rule: 'required', message })
const moneyValidation: SupportedApartmentSaleQuestionValidation = { rule: 'money', message: 'Укажите сумму в рублях без копеек, только цифрами.' }
const dateValidation: SupportedApartmentSaleQuestionValidation = { rule: 'date', message: 'Укажите дату в формате ГГГГ-ММ-ДД.' }

export const supportedApartmentSaleWizardSteps: readonly SupportedApartmentSaleWizardStep[] = [
	{ id: 'entry', title: 'Проверка сценария', description: 'Подтверждаем, что случай входит в поддерживаемый MVP-сценарий.' },
	{ id: 'taxpayer', title: 'Данные налогоплательщика', description: 'Собираем личные данные, паспорт и адрес регистрации.' },
	{ id: 'apartment', title: 'Данные квартиры', description: 'Фиксируем объект продажи и его кадастровый номер.' },
	{ id: 'acquisition', title: 'Покупка квартиры', description: 'Собираем даты и суммы по покупке, которые влияют на льготу и вычет.' },
	{ id: 'sale', title: 'Продажа квартиры', description: 'Собираем дату и сумму продажи для декларации 2025 года.' },
	{ id: 'cadastral-value', title: 'Кадастровая стоимость', description: 'Нужна стоимость на 1 января 2025 года для проверки правила 70%.' },
	{ id: 'reduction-choice', title: 'Способ уменьшения дохода', description: 'Фиксируем выбор между расходами на покупку и фиксированным имущественным вычетом.' }
]

export const supportedApartmentSaleQuestionCatalog: readonly SupportedApartmentSaleWizardQuestion[] = [
	{
		id: 'declaration-year',
		step: 'entry',
		draftPath: 'sourceData.entry.declarationYear',
		inputKind: 'radio',
		label: 'За какой год нужна декларация?',
		helpText: 'В первой версии поддерживается только декларация за 2025 год.',
		whereToFind: 'Обычно это год, в котором была продажа квартиры и за который вы подаете 3-НДФЛ.',
		example: '2025',
		choices: [
			{ value: '2025', label: '2025' },
			{ value: 'other', label: 'Другой год' }
		],
		validation: [requiredValidation('Выберите год декларации.')]
	},
	{
		id: 'residency-status',
		step: 'entry',
		draftPath: 'sourceData.entry.residencyStatus',
		canonicalPath: 'taxpayer.residencyStatus',
		inputKind: 'radio',
		label: 'Вы были налоговым резидентом РФ в 2025 году?',
		helpText: 'Для MVP поддерживается только резидент РФ.',
		whereToFind: 'Оцените, находились ли вы в России не менее 183 дней за 12 месяцев подряд.',
		example: 'Да, я налоговый резидент РФ',
		choices: [
			{ value: 'resident', label: 'Да' },
			{ value: 'other', label: 'Нет' }
		],
		validation: [requiredValidation('Подтвердите статус налогового резидента.')]
	},
	{
		id: 'property-type',
		step: 'entry',
		draftPath: 'sourceData.entry.propertyType',
		inputKind: 'radio',
		label: 'Что вы продали?',
		helpText: 'Сейчас поддерживается только продажа одной квартиры.',
		whereToFind: 'Посмотрите договор продажи или выписку ЕГРН.',
		example: 'Квартира',
		choices: [
			{ value: 'apartment', label: 'Квартира' },
			{ value: 'other', label: 'Другой объект' }
		],
		validation: [requiredValidation('Выберите тип объекта.')]
	},
	{
		id: 'ownership-kind',
		step: 'entry',
		draftPath: 'sourceData.entry.ownershipKind',
		canonicalPath: 'apartment.ownershipKind',
		inputKind: 'radio',
		label: 'Как была оформлена собственность?',
		helpText: 'Поддерживается только один собственник без долей.',
		whereToFind: 'Это видно в выписке ЕГРН или договоре купли-продажи.',
		example: 'Один собственник, без долей',
		choices: [
			{ value: 'sole-owner-no-shares', label: 'Один собственник, без долей' },
			{ value: 'other', label: 'Есть доли или несколько собственников' }
		],
		validation: [requiredValidation('Подтвердите формат собственности.')]
	},
	{
		id: 'acquisition-method',
		step: 'entry',
		draftPath: 'sourceData.entry.acquisitionMethod',
		canonicalPath: 'acquisition.method',
		inputKind: 'radio',
		label: 'Как квартира была приобретена?',
		helpText: 'В первой версии поддерживается только покупка квартиры.',
		whereToFind: 'Посмотрите основание права собственности в выписке ЕГРН или договор покупки.',
		example: 'Покупка',
		choices: [
			{ value: 'purchase', label: 'Покупка' },
			{ value: 'other', label: 'Другое основание' }
		],
		validation: [requiredValidation('Выберите основание приобретения квартиры.')]
	},
	{
		id: 'last-name',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.lastName',
		canonicalPath: 'taxpayer.lastName',
		inputKind: 'text',
		label: 'Фамилия',
		helpText: 'Укажите фамилию так, как она написана в паспорте.',
		whereToFind: 'Паспорт гражданина РФ, страница с ФИО.',
		example: 'Иванов',
		validation: [requiredValidation('Укажите фамилию.')]
	},
	{
		id: 'first-name',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.firstName',
		canonicalPath: 'taxpayer.firstName',
		inputKind: 'text',
		label: 'Имя',
		helpText: 'Укажите имя без сокращений.',
		whereToFind: 'Паспорт гражданина РФ, страница с ФИО.',
		example: 'Иван',
		validation: [requiredValidation('Укажите имя.')]
	},
	{
		id: 'middle-name',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.middleName',
		canonicalPath: 'taxpayer.middleName',
		inputKind: 'text',
		label: 'Отчество',
		helpText: 'Если в паспорте отчества нет, поле можно оставить пустым.',
		whereToFind: 'Паспорт гражданина РФ, страница с ФИО.',
		example: 'Иванович',
		validation: []
	},
	{
		id: 'inn',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.inn',
		canonicalPath: 'taxpayer.inn',
		inputKind: 'text',
		label: 'ИНН',
		helpText: 'ИНН пригодится для декларации, если он у вас есть.',
		whereToFind: 'Свидетельство о постановке на учет, личный кабинет налогоплательщика или Госуслуги.',
		example: '123456789012',
		validation: [{ rule: 'inn', message: 'ИНН физлица должен содержать 12 цифр.' }]
	},
	{
		id: 'birth-date',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.birthDate',
		canonicalPath: 'taxpayer.birthDate',
		inputKind: 'date',
		label: 'Дата рождения',
		helpText: 'Укажите дату рождения владельца квартиры.',
		whereToFind: 'Паспорт гражданина РФ, страница с датой рождения.',
		example: '1988-04-12',
		validation: [requiredValidation('Укажите дату рождения.'), dateValidation]
	},
	{
		id: 'passport-series',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.passportSeries',
		canonicalPath: 'taxpayer.passport.series',
		inputKind: 'text',
		label: 'Серия паспорта',
		helpText: 'Нужны 4 цифры серии без пробелов.',
		whereToFind: 'Паспорт гражданина РФ, верхняя часть страницы с реквизитами.',
		example: '4510',
		validation: [requiredValidation('Укажите серию паспорта.'), { rule: 'passport-series', message: 'Серия паспорта должна содержать 4 цифры.' }]
	},
	{
		id: 'passport-number',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.passportNumber',
		canonicalPath: 'taxpayer.passport.number',
		inputKind: 'text',
		label: 'Номер паспорта',
		helpText: 'Нужны 6 цифр номера без пробелов.',
		whereToFind: 'Паспорт гражданина РФ, страница с реквизитами.',
		example: '123456',
		validation: [requiredValidation('Укажите номер паспорта.'), { rule: 'passport-number', message: 'Номер паспорта должен содержать 6 цифр.' }]
	},
	{
		id: 'passport-issue-date',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.passportIssueDate',
		canonicalPath: 'taxpayer.passport.issueDate',
		inputKind: 'date',
		label: 'Дата выдачи паспорта',
		helpText: 'Дата нужна для корректного заполнения личных данных.',
		whereToFind: 'Паспорт гражданина РФ, страница с реквизитами.',
		example: '2018-07-01',
		validation: [requiredValidation('Укажите дату выдачи паспорта.'), dateValidation]
	},
	{
		id: 'passport-issuer-name',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.passportIssuerName',
		canonicalPath: 'taxpayer.passport.issuerName',
		inputKind: 'text',
		label: 'Кем выдан паспорт',
		helpText: 'Перепишите название органа так, как оно указано в паспорте.',
		whereToFind: 'Паспорт гражданина РФ, страница с реквизитами.',
		example: 'Отделением УФМС России по г. Москве',
		validation: [requiredValidation('Укажите, кем выдан паспорт.')]
	},
	{
		id: 'passport-issuer-code',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.passportIssuerCode',
		canonicalPath: 'taxpayer.passport.issuerCode',
		inputKind: 'text',
		label: 'Код подразделения',
		helpText: 'Если код есть в паспорте, укажите его в формате 000-000.',
		whereToFind: 'Паспорт гражданина РФ, строка рядом с датой выдачи.',
		example: '770-001',
		validation: [{ rule: 'passport-issuer-code', message: 'Код подразделения должен быть в формате 000-000.' }]
	},
	{
		id: 'registration-region',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.registrationAddress.region',
		canonicalPath: 'taxpayer.registrationAddress.region',
		inputKind: 'text',
		label: 'Регион регистрации',
		helpText: 'Нужен регион вашей постоянной регистрации.',
		whereToFind: 'Штамп регистрации в паспорте или адрес регистрации из подтверждающего документа.',
		example: 'г. Москва',
		validation: [requiredValidation('Укажите регион регистрации.')]
	},
	{
		id: 'registration-city',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.registrationAddress.city',
		canonicalPath: 'taxpayer.registrationAddress.city',
		inputKind: 'text',
		label: 'Город регистрации',
		helpText: 'Если вы зарегистрированы в городе федерального значения, можно повторить название региона.',
		whereToFind: 'Штамп регистрации в паспорте.',
		example: 'Москва',
		validation: [requiredValidation('Укажите город регистрации.')]
	},
	{
		id: 'registration-street',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.registrationAddress.street',
		canonicalPath: 'taxpayer.registrationAddress.street',
		inputKind: 'text',
		label: 'Улица регистрации',
		helpText: 'Укажите улицу без лишних сокращений.',
		whereToFind: 'Штамп регистрации в паспорте.',
		example: 'Ленинградский проспект',
		validation: [requiredValidation('Укажите улицу регистрации.')]
	},
	{
		id: 'registration-house',
		step: 'taxpayer',
		draftPath: 'sourceData.taxpayer.registrationAddress.house',
		canonicalPath: 'taxpayer.registrationAddress.house',
		inputKind: 'text',
		label: 'Дом регистрации',
		helpText: 'Достаточно номера дома; корпус можно уточнить отдельным полем позже.',
		whereToFind: 'Штамп регистрации в паспорте.',
		example: '36',
		validation: [requiredValidation('Укажите номер дома регистрации.')]
	},
	{
		id: 'cadastral-number',
		step: 'apartment',
		draftPath: 'sourceData.apartment.cadastralNumber',
		canonicalPath: 'apartment.cadastralNumber',
		inputKind: 'text',
		label: 'Кадастровый номер квартиры',
		helpText: 'Он нужен для идентификации объекта и проверки кадастровой стоимости.',
		whereToFind: 'Выписка ЕГРН, договор купли-продажи, уведомление из Росреестра.',
		example: '77:01:0004012:3456',
		validation: [requiredValidation('Укажите кадастровый номер квартиры.'), { rule: 'cadastral-number', message: 'Кадастровый номер должен быть в формате 00:00:0000000:0.' }]
	},
	{
		id: 'apartment-address',
		step: 'apartment',
		draftPath: 'sourceData.apartment.addressText',
		canonicalPath: 'apartment.addressText',
		inputKind: 'text',
		label: 'Адрес квартиры',
		helpText: 'Укажите адрес продаваемой квартиры одной строкой.',
		whereToFind: 'Выписка ЕГРН или договор продажи.',
		example: 'г. Москва, ул. Пушкина, д. 10, кв. 25',
		validation: [requiredValidation('Укажите адрес квартиры.')]
	},
	{
		id: 'purchase-date',
		step: 'acquisition',
		draftPath: 'sourceData.acquisition.purchaseDate',
		canonicalPath: 'acquisition.purchaseDate',
		inputKind: 'date',
		label: 'Дата договора покупки',
		helpText: 'Это дата подписания договора, по которому вы купили квартиру.',
		whereToFind: 'Договор купли-продажи на покупку квартиры.',
		example: '2019-06-15',
		validation: [requiredValidation('Укажите дату покупки.'), dateValidation]
	},
	{
		id: 'ownership-registration-date',
		step: 'acquisition',
		draftPath: 'sourceData.acquisition.ownershipRegistrationDate',
		canonicalPath: 'acquisition.ownershipRegistrationDate',
		inputKind: 'date',
		label: 'Дата регистрации права собственности',
		helpText: 'Эта дата нужна для проверки минимального срока владения.',
		whereToFind: 'Выписка ЕГРН или старое свидетельство о регистрации права.',
		example: '2019-07-03',
		validation: [requiredValidation('Укажите дату регистрации права собственности.'), dateValidation]
	},
	{
		id: 'purchase-price-rub',
		step: 'acquisition',
		draftPath: 'sourceData.acquisition.purchasePriceRub',
		canonicalPath: 'acquisition.purchasePriceRub',
		inputKind: 'money',
		label: 'Цена покупки квартиры',
		helpText: 'Укажите сумму из договора покупки в рублях без копеек.',
		whereToFind: 'Договор купли-продажи на покупку квартиры.',
		example: '6500000',
		validation: [requiredValidation('Укажите цену покупки квартиры.'), moneyValidation]
	},
	{
		id: 'documented-purchase-expenses-rub',
		step: 'acquisition',
		draftPath: 'sourceData.acquisition.documentedPurchaseExpensesRub',
		canonicalPath: 'acquisition.documentedPurchaseExpensesRub',
		inputKind: 'money',
		label: 'Подтвержденные расходы на покупку',
		helpText: 'Обычно это сумма покупки, если у вас есть подтверждающие документы на всю сумму.',
		whereToFind: 'Договор покупки, расписка, платежные поручения, банковские документы.',
		example: '6500000',
		validation: [requiredValidation('Укажите подтвержденные расходы на покупку.'), moneyValidation]
	},
	{
		id: 'sale-date',
		step: 'sale',
		draftPath: 'sourceData.sale.saleDate',
		canonicalPath: 'sale.saleDate',
		inputKind: 'date',
		label: 'Дата продажи квартиры',
		helpText: 'Для поддерживаемого сценария дата продажи должна относиться к 2025 году.',
		whereToFind: 'Договор купли-продажи на продажу квартиры.',
		example: '2025-03-20',
		validation: [requiredValidation('Укажите дату продажи квартиры.'), dateValidation]
	},
	{
		id: 'sale-price-rub',
		step: 'sale',
		draftPath: 'sourceData.sale.salePriceRub',
		canonicalPath: 'sale.salePriceRub',
		inputKind: 'money',
		label: 'Цена продажи квартиры',
		helpText: 'Укажите сумму дохода по договору продажи в рублях без копеек.',
		whereToFind: 'Договор продажи квартиры.',
		example: '9200000',
		validation: [requiredValidation('Укажите цену продажи квартиры.'), moneyValidation]
	},
	{
		id: 'cadastral-value-amount-rub',
		step: 'cadastral-value',
		draftPath: 'sourceData.cadastralValue.amountRub',
		canonicalPath: 'cadastralValue.amountRub',
		inputKind: 'money',
		label: 'Кадастровая стоимость на 1 января 2025 года',
		helpText: 'Она нужна для проверки, не ниже ли доход от продажи минимальной расчетной базы.',
		whereToFind: 'Выписка ЕГРН, отчет Росреестра или справка о кадастровой стоимости.',
		example: '11000000',
		validation: [requiredValidation('Укажите кадастровую стоимость на 1 января 2025 года.'), moneyValidation]
	},
	{
		id: 'reduction-method',
		step: 'reduction-choice',
		draftPath: 'sourceData.reductionChoice.reductionMethod',
		canonicalPath: 'reductionMethod',
		inputKind: 'radio',
		label: 'Какой способ уменьшения дохода использовать?',
		helpText: 'Если продажа облагается налогом, нужно выбрать один способ уменьшения дохода для экспорта.',
		whereToFind: 'Это решение пользователь принимает после подсказки системы о доступных вариантах.',
		example: 'Уменьшить доход на подтвержденные расходы на покупку',
		choices: [
			{ value: 'documented-purchase-expenses', label: 'Подтвержденные расходы на покупку' },
			{ value: 'fixed-property-deduction', label: 'Фиксированный имущественный вычет' }
		],
		validation: [requiredValidation('Выберите способ уменьшения дохода.')]
	}
]

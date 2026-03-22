export const SUPPORTED_APARTMENT_SALE_SCENARIO = 'apartment-sale-2025'
export const SUPPORTED_APARTMENT_SALE_TAX_YEAR = 2025
export const SUPPORTED_CADASTRAL_ASSESSMENT_DATE = '2025-01-01'

export type SupportedApartmentSaleScenario = typeof SUPPORTED_APARTMENT_SALE_SCENARIO
export type SupportedApartmentSaleTaxYear = typeof SUPPORTED_APARTMENT_SALE_TAX_YEAR
export type SupportedCadastralAssessmentDate = typeof SUPPORTED_CADASTRAL_ASSESSMENT_DATE
export type IsoDateString = string

export type SupportedApartmentSaleReductionMethod = 'documented-purchase-expenses' | 'fixed-property-deduction'
export type SupportedApartmentSaleAcquisitionMethod = 'purchase'
export type SupportedApartmentSaleResidencyStatus = 'resident'
export type SupportedApartmentSaleOwnershipKind = 'sole-owner-no-shares'

export interface SupportedApartmentSalePassport {
	series: string
	number: string
	issueDate: IsoDateString
	issuerName: string
	issuerCode?: string
}

export interface SupportedApartmentSaleTaxpayerAddress {
	region: string
	city: string
	street: string
	house: string
	postalCode?: string
	district?: string
	settlement?: string
	building?: string
	apartment?: string
}

export interface SupportedApartmentSaleTaxpayer {
	residencyStatus: SupportedApartmentSaleResidencyStatus
	lastName: string
	firstName: string
	middleName?: string
	inn?: string
	birthDate: IsoDateString
	passport: SupportedApartmentSalePassport
	registrationAddress: SupportedApartmentSaleTaxpayerAddress
}

export interface SupportedApartmentSaleApartment {
	ownershipKind: SupportedApartmentSaleOwnershipKind
	cadastralNumber: string
	addressText: string
}

export interface SupportedApartmentSaleAcquisition {
	method: SupportedApartmentSaleAcquisitionMethod
	purchaseDate: IsoDateString
	ownershipRegistrationDate: IsoDateString
	purchasePriceRub: number
	documentedPurchaseExpensesRub: number
}

export interface SupportedApartmentSaleSale {
	saleDate: IsoDateString
	salePriceRub: number
}

export interface SupportedApartmentSaleCadastralValue {
	assessmentDate: SupportedCadastralAssessmentDate
	amountRub: number
}

export interface SupportedApartmentSaleCase {
	scenario: SupportedApartmentSaleScenario
	taxYear: SupportedApartmentSaleTaxYear
	taxpayer: SupportedApartmentSaleTaxpayer
	apartment: SupportedApartmentSaleApartment
	acquisition: SupportedApartmentSaleAcquisition
	sale: SupportedApartmentSaleSale
	cadastralValue: SupportedApartmentSaleCadastralValue
	reductionMethod: SupportedApartmentSaleReductionMethod
}

export interface PersistedSupportedApartmentSaleEntryDraft {
	declarationYear?: string
	residencyStatus?: SupportedApartmentSaleResidencyStatus | 'other'
	propertyType?: 'apartment' | 'other'
	ownershipKind?: SupportedApartmentSaleOwnershipKind | 'other'
	acquisitionMethod?: SupportedApartmentSaleAcquisitionMethod | 'other'
}

export interface PersistedSupportedApartmentSaleTaxpayerDraft {
	lastName?: string
	firstName?: string
	middleName?: string
	inn?: string
	birthDate?: IsoDateString
	passportSeries?: string
	passportNumber?: string
	passportIssueDate?: IsoDateString
	passportIssuerName?: string
	passportIssuerCode?: string
	registrationAddress?: {
		region?: string
		city?: string
		street?: string
		house?: string
		postalCode?: string
		district?: string
		settlement?: string
		building?: string
		apartment?: string
	}
}

export interface PersistedSupportedApartmentSaleDraftSourceData {
	entry?: PersistedSupportedApartmentSaleEntryDraft
	taxpayer?: PersistedSupportedApartmentSaleTaxpayerDraft
	apartment?: {
		cadastralNumber?: string
		addressText?: string
	}
	acquisition?: {
		purchaseDate?: IsoDateString
		ownershipRegistrationDate?: IsoDateString
		purchasePriceRub?: string
		documentedPurchaseExpensesRub?: string
	}
	sale?: {
		saleDate?: IsoDateString
		salePriceRub?: string
	}
	cadastralValue?: {
		amountRub?: string
	}
	reductionChoice?: {
		reductionMethod?: SupportedApartmentSaleReductionMethod
	}
}

export interface PersistedSupportedApartmentSaleDraft {
	version: 1
	scenario: SupportedApartmentSaleScenario
	sourceData: PersistedSupportedApartmentSaleDraftSourceData
}

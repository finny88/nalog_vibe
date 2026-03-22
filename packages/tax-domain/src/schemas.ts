import { z } from 'zod'
import { SUPPORTED_APARTMENT_SALE_SCENARIO, SUPPORTED_APARTMENT_SALE_TAX_YEAR, SUPPORTED_CADASTRAL_ASSESSMENT_DATE } from './model.js'

const isoDateMessage = 'Use ISO date format YYYY-MM-DD'
const moneyMessage = 'Enter a whole-ruble amount greater than zero'
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, isoDateMessage)
const optionalIsoDateSchema = isoDateSchema.optional()
const positiveMoneySchema = z.number().finite().positive(moneyMessage)
const rubleAmountStringSchema = z.string().regex(/^\d+$/u, 'Enter the amount using digits only')
const optionalTrimmedStringSchema = z.string().trim().min(1).optional()
const taxpayerAddressSchema = z.object({
	region: z.string().trim().min(1),
	city: z.string().trim().min(1),
	street: z.string().trim().min(1),
	house: z.string().trim().min(1),
	postalCode: z
		.string()
		.regex(/^\d{6}$/u, 'Postal code must contain 6 digits')
		.optional(),
	district: optionalTrimmedStringSchema,
	settlement: optionalTrimmedStringSchema,
	building: optionalTrimmedStringSchema,
	apartment: optionalTrimmedStringSchema
})

export const supportedApartmentSaleCaseSchema = z.object({
	scenario: z.literal(SUPPORTED_APARTMENT_SALE_SCENARIO),
	taxYear: z.literal(SUPPORTED_APARTMENT_SALE_TAX_YEAR),
	taxpayer: z.object({
		residencyStatus: z.literal('resident'),
		lastName: z.string().trim().min(1),
		firstName: z.string().trim().min(1),
		middleName: optionalTrimmedStringSchema,
		inn: z
			.string()
			.regex(/^\d{12}$/u, 'INN must contain 12 digits')
			.optional(),
		birthDate: isoDateSchema,
		passport: z.object({
			series: z.string().regex(/^\d{4}$/u, 'Passport series must contain 4 digits'),
			number: z.string().regex(/^\d{6}$/u, 'Passport number must contain 6 digits'),
			issueDate: isoDateSchema,
			issuerName: z.string().trim().min(1),
			issuerCode: z
				.string()
				.regex(/^\d{3}-\d{3}$/u, 'Passport issuer code must match NNN-NNN')
				.optional()
		}),
		registrationAddress: taxpayerAddressSchema
	}),
	apartment: z.object({
		ownershipKind: z.literal('sole-owner-no-shares'),
		cadastralNumber: z.string().regex(/^\d{2}:\d{2}:\d{1,7}:\d+$/u, 'Cadastral number must look like 77:01:0004012:3456'),
		addressText: z.string().trim().min(1)
	}),
	acquisition: z.object({
		method: z.literal('purchase'),
		purchaseDate: isoDateSchema,
		ownershipRegistrationDate: isoDateSchema,
		purchasePriceRub: positiveMoneySchema,
		documentedPurchaseExpensesRub: z.number().finite().nonnegative('Documented expenses cannot be negative')
	}),
	sale: z.object({
		saleDate: isoDateSchema.refine((value) => value.startsWith('2025-'), 'Sale date must be in 2025 for the supported case'),
		salePriceRub: positiveMoneySchema
	}),
	cadastralValue: z.object({
		assessmentDate: z.literal(SUPPORTED_CADASTRAL_ASSESSMENT_DATE),
		amountRub: positiveMoneySchema
	}),
	reductionMethod: z.enum(['documented-purchase-expenses', 'fixed-property-deduction'])
})

export const supportedApartmentSaleBackendInputSchema = supportedApartmentSaleCaseSchema

export const persistedSupportedApartmentSaleDraftSchema = z.object({
	version: z.literal(1),
	scenario: z.literal(SUPPORTED_APARTMENT_SALE_SCENARIO),
	sourceData: z.object({
		entry: z
			.object({
				declarationYear: z.string().optional(),
				residencyStatus: z.enum(['resident', 'other']).optional(),
				propertyType: z.enum(['apartment', 'other']).optional(),
				ownershipKind: z.enum(['sole-owner-no-shares', 'other']).optional(),
				acquisitionMethod: z.enum(['purchase', 'other']).optional()
			})
			.optional(),
		taxpayer: z
			.object({
				lastName: optionalTrimmedStringSchema,
				firstName: optionalTrimmedStringSchema,
				middleName: optionalTrimmedStringSchema,
				inn: z
					.string()
					.regex(/^\d{12}$/u, 'INN must contain 12 digits')
					.optional(),
				birthDate: optionalIsoDateSchema,
				passportSeries: z
					.string()
					.regex(/^\d{4}$/u, 'Passport series must contain 4 digits')
					.optional(),
				passportNumber: z
					.string()
					.regex(/^\d{6}$/u, 'Passport number must contain 6 digits')
					.optional(),
				passportIssueDate: optionalIsoDateSchema,
				passportIssuerName: optionalTrimmedStringSchema,
				passportIssuerCode: z
					.string()
					.regex(/^\d{3}-\d{3}$/u, 'Passport issuer code must match NNN-NNN')
					.optional(),
				registrationAddress: taxpayerAddressSchema.partial().optional()
			})
			.optional(),
		apartment: z
			.object({
				cadastralNumber: z
					.string()
					.regex(/^\d{2}:\d{2}:\d{1,7}:\d+$/u, 'Cadastral number must look like 77:01:0004012:3456')
					.optional(),
				addressText: optionalTrimmedStringSchema
			})
			.optional(),
		acquisition: z
			.object({
				purchaseDate: optionalIsoDateSchema,
				ownershipRegistrationDate: optionalIsoDateSchema,
				purchasePriceRub: rubleAmountStringSchema.optional(),
				documentedPurchaseExpensesRub: rubleAmountStringSchema.optional()
			})
			.optional(),
		sale: z
			.object({
				saleDate: optionalIsoDateSchema,
				salePriceRub: rubleAmountStringSchema.optional()
			})
			.optional(),
		cadastralValue: z
			.object({
				amountRub: rubleAmountStringSchema.optional()
			})
			.optional(),
		reductionChoice: z
			.object({
				reductionMethod: z.enum(['documented-purchase-expenses', 'fixed-property-deduction']).optional()
			})
			.optional()
	})
})

export type SupportedApartmentSaleCaseInput = z.infer<typeof supportedApartmentSaleCaseSchema>
export type SupportedApartmentSaleBackendInput = z.infer<typeof supportedApartmentSaleBackendInputSchema>
export type PersistedSupportedApartmentSaleDraftInput = z.infer<typeof persistedSupportedApartmentSaleDraftSchema>

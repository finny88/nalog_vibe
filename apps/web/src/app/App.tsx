import { Badge, Container, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'
import classes from './App.module.css'

export const App = () => (
	<div className={classes.shell}>
		<Container size={'md'} className={classes.container}>
			<Paper radius={'xl'} shadow={'md'} className={classes.card}>
				<Stack gap={'lg'}>
					<ThemeIcon variant={'light'} radius={'xl'} size={56} color={'teal'}>
						<IconHome size={28} stroke={1.8} />
					</ThemeIcon>
					<Stack gap={'xs'}>
						<Badge variant={'light'} color={'teal'} className={classes.badge}>
							Bootstrap
						</Badge>
						<Title order={1}>Монорепа готова к реализации мастера 3-НДФЛ</Title>
						<Text c={'dimmed'}>
							Здесь будет пошаговый сценарий продажи квартиры за 2025 год. На этом этапе уже подключены базовые зависимости, shared tooling и каркас приложений web/api.
						</Text>
					</Stack>
				</Stack>
			</Paper>
		</Container>
	</div>
)
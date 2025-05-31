import { Typography } from "antd";
import cl from "./AboutService.module.scss";

const { Title, Text } = Typography;

const AboutService = () => {
	return (
		<div className={cl.aboutService}>
			<Title style={{fontSize: 31}}>Классификация ответов опросов</Title>

			<div className={cl.description}>
				<Text style={{ fontSize: 18 }}>
					- Приложение-помощник в разметке и классификации результатов опроса
				</Text>

				<br />

				<Text style={{ fontSize: 18 }}>
					- Загружаемый файл должен иметь указанный формат:
				</Text>
			</div>
		</div>
	);
};

export default AboutService;
import { useState, useContext, useRef } from "react";
import { HomePageContext } from "../../context/HomePageContext";

function HomePage() {
	const context = useContext(HomePageContext);
	const [prediction, setPrediction] = useState<any>();
	const imgRef = useRef<HTMLImageElement | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const handlePredict = async () => {
		if (!context) return;

		if (imgRef.current) {
			await context.predict(imgRef.current);
			setPrediction(1);
		}
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageUrl(reader.result as string); // Establecer la imagen cargada en el estado
			};
			reader.readAsDataURL(file); // Leer el archivo como URL
		}
	};

	return (
		<div className="container py-5">
			<h1 className="text-center mb-4">Predicción con TensorFlow.js</h1>

			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-sm">
						<div className="card-body">
							<h4 className="card-title text-center">Sube una imagen para predecir</h4>

							{/* Campo para cargar la imagen */}
							<div className="mb-4">
								<input type="file" className="form-control" onChange={handleImageUpload} accept="image/*" />
							</div>

							{/* Mostrar la imagen cargada */}
							{imageUrl && (
								<div className="text-center mb-4">
									<img
										ref={imgRef}
										src={imageUrl}
										alt="Imagen para analizar"
										className="img-fluid"
										style={{ maxHeight: "300px", objectFit: "cover" }}
									/>
								</div>
							)}

							<div className="text-center">
								<button className="btn btn-primary" onClick={handlePredict}>
									Predecir
								</button>
							</div>

							{prediction && (
								<div className="mt-4">
									<h5 className="text-center">Resultado de la Predicción:</h5>
									<p className="text-center">{context?.classname}</p>
                  <p className="text-center">{context?.proability.toFixed(2)}%</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomePage;

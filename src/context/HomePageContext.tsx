import React, { createContext, useState, useEffect } from "react";
import { LayersModel, loadLayersModel, browser, scalar, Tensor, string } from "@tensorflow/tfjs";
import classnames from "../models/classnames";

interface IHomePageContext {
	classname?: string;
	proability: number
	loadModel: () => Promise<void>;
	predict: (image: HTMLImageElement) => Promise<void>;
}

export const HomePageContext = createContext<IHomePageContext | null>(null);

export const HomePageProvider = ({ children }: React.PropsWithChildren) => {
	const [model, setModel] = useState<LayersModel | null>(null);
	const [classname, setClassname] = useState<string>()
	const [proability, setProability] = useState<number>(0)

	const loadModel = async () => {
		try {
			const loadedModel = await loadLayersModel("/models/model.json");
			setModel(loadedModel);
			console.log("Modelo cargado correctamente");
		} catch (e) {
			console.error("Error al cargar el modelo:", e);
		}
	};

	const predict = async (image: HTMLImageElement) => {
		if (!model) {
			console.error("El modelo no está cargado.");
			return;
		}

		const tensor = browser
			.fromPixels(image)
			.resizeNearestNeighbor([128, 128]) // Cambia el tamaño a 100x100
			.toFloat()
			.expandDims(0)
			.div(scalar(255));
		const prediction = (await model.predict(tensor)) as Tensor;
		const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
		const predictedClassProbability = prediction.dataSync()[predictedClassIndex];
		const predictedClassPercentage = predictedClassProbability * 100;

		setClassname(classnames[predictedClassIndex])
		setProability(predictedClassPercentage)
	};

	useEffect(() => {
		loadModel();
	}, []);

	return <HomePageContext value={{ loadModel, predict, proability, classname }}>{children}</HomePageContext>;
};

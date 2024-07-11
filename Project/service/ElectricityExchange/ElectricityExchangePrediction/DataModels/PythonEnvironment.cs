using Python.Runtime;
using System;
using System.IO;

public class PythonEnvironment
{
    private static readonly Lazy<PythonEnvironment> instance = new Lazy<PythonEnvironment>(() => new PythonEnvironment());
    public static PythonEnvironment Instance => instance.Value;

    public dynamic ConsumptionModel { get; private set; }
    public dynamic GenerationModel { get; private set; }

    private PythonEnvironment()
    {
        InitializePython();
        LoadModels();
    }

    private void InitializePython()
    {
        string pythonPath = @"C:\Python312";
        string pythonDllPath = Path.Combine(pythonPath, "python312.dll");

        if (!System.IO.File.Exists(pythonDllPath))
        {
            throw new FileNotFoundException($"Python DLL not found at {pythonDllPath}");
        }

        Environment.SetEnvironmentVariable("PYTHONHOME", pythonPath, EnvironmentVariableTarget.Process);
        Environment.SetEnvironmentVariable("PYTHONPATH", pythonPath, EnvironmentVariableTarget.Process);
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", pythonDllPath, EnvironmentVariableTarget.Process);
        Environment.SetEnvironmentVariable("PATH", pythonPath + ";" + Path.Combine(pythonPath, "Scripts") + ";" + Environment.GetEnvironmentVariable("PATH", EnvironmentVariableTarget.Process), EnvironmentVariableTarget.Process);

        try
        {
            PythonEngine.Initialize();
            PythonEngine.BeginAllowThreads(); // Release GIL to allow other threads to run Python code

            using (Py.GIL())
            {
                dynamic six = Py.Import("six");
            }
        }
        catch (PythonException ex)
        {
            throw new Exception($"Failed to import 'six' module: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to initialize Python engine: {ex.Message}", ex);
        }
    }

    private void LoadModels()
    {
        string consumptionModelJsonPath = "Neural-NetworkModels/ElectricityConsumption-Serbia/model1.json";
        string consumptionModelWeightsPath = "Neural-NetworkModels/ElectricityConsumption-Serbia/model1.weights.h5";
        string generationModelJsonPath = "Neural-NetworkModels/ElectricityGenerate-Serbia/model1.json";
        string generationModelWeightsPath = "Neural-NetworkModels/ElectricityGenerate-Serbia/model1.weights.h5";

        try
        {
            string consumptionModelJson = File.ReadAllText(consumptionModelJsonPath);
            string generationModelJson = File.ReadAllText(generationModelJsonPath);

            using (Py.GIL())
            {
                dynamic tf = Py.Import("tensorflow");
                dynamic models = tf.keras.models;

                ConsumptionModel = models.model_from_json(consumptionModelJson);
                ConsumptionModel.load_weights(consumptionModelWeightsPath);

                GenerationModel = models.model_from_json(generationModelJson);
                GenerationModel.load_weights(generationModelWeightsPath);
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error loading models: {ex.Message}", ex);
        }
    }

    public void EnsurePythonInitialized()
    {
        try
        {
            Console.WriteLine("Attempting to acquire GIL for Python environment test.");
            using (Py.GIL())
            {
                // Test if Python is still functional
                Console.WriteLine("Acquired GIL. Testing Python environment.");
                dynamic np = Py.Import("numpy");
                dynamic tf = Py.Import("tensorflow");
                Console.WriteLine("Python environment is functional.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error occurred while testing Python environment: {ex.Message}");
            Console.WriteLine("Reinitializing Python environment.");

            try
            {
                PythonEngine.Shutdown();
                InitializePython();
                LoadModels();
                Console.WriteLine("Python environment reinitialized successfully.");
            }
            catch (Exception reinitEx)
            {
                Console.WriteLine($"Error reinitializing Python environment: {reinitEx.Message}");
                throw;  // Re-throw to ensure the application knows reinitialization failed
            }
        }
    }
}

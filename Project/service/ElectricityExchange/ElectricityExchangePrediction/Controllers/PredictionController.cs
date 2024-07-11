using ElectricityExchangePrediction.DataModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using System.Collections.Generic;
using System.Fabric;
using System;
using System.IO;
using System.Text;
using Python.Runtime;
namespace ElectricityExchangePrediction.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PredictionController : ControllerBase
    {
        private readonly PythonEnvironment pythonEnv;

        public PredictionController()
        {
            pythonEnv = PythonEnvironment.Instance;
        }

        [HttpGet]
        public IActionResult GetExchangeValues([FromQuery] int day, [FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                pythonEnv.EnsurePythonInitialized();

                using (Py.GIL())
                {
                    List<double> resultsConsumption = new List<double>();
                    List<double> resultsGeneration = new List<double>();

                    dynamic np = Py.Import("numpy");
                    dynamic tf = Py.Import("tensorflow");

                    for (int i = 0; i < 24; i++)
                    {
                        dynamic inputData = np.array(new int[,] { { year, month, day, i } });
                        inputData = tf.convert_to_tensor(inputData, dtype: tf.uint8);

                        dynamic resultConsumption = pythonEnv.ConsumptionModel.predict(inputData);
                        dynamic resultGeneration = pythonEnv.GenerationModel.predict(inputData);

                        double predictGeneration = (double)resultGeneration[0][0].item();
                        double predictionConsumption = (double)resultConsumption[0][0].item();

                        resultsGeneration.Add(predictGeneration);
                        resultsConsumption.Add(predictionConsumption);
                    }

                    var response = new
                    {
                        resultsGeneration = resultsGeneration,
                        resultsConsumption = resultsConsumption
                    };

                    return Ok(response);
                }
            }
            catch (PythonException ex)
            {
                Console.WriteLine($"Python error: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Python error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error making prediction: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Error making prediction: {ex.Message}");
            }
        }
    }
}

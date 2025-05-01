import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PatientServices } from "./patient.service";

const updatePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.updatePatientIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient updated Successfully",
    data: result,
  });
});
const deletePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.deletePatientFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted Successfully",
    data: result,
  });
});

export const PatientController = {
  updatePatient,
  deletePatient,
};

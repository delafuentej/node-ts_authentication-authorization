
import { Response, Request} from "express";
import { FileUploadService } from "../services";
import { CustomError } from "../../domain";
import type{ UploadedFile } from "express-fileupload";


export class FileUploadController {

    constructor(
       private readonly fileUploadService: FileUploadService,
    ){};

    private handleError = (res: Response, error: unknown) => {

        if( error instanceof CustomError){
            res.status(error.statusCode).json({ error: error.message});
            return;
        };
        console.log(`${error}`);
        res.status(500).json({ error: 'Internal Server Error'});

    }

    uploadFile = async(req: Request, res: Response) => {
        const type = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

      //console.log({body: req.body})

      this.fileUploadService.uploadFile(file, `uploads/${type}`)
       .then( uploadedFile => res.json(uploadedFile))
       .catch( error => this.handleError(res, error))

    };

    uploadMultipleFiles = (req: Request, res: Response) => {

        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

     //console.log({body: req.body})

     this.fileUploadService.uploadMultipleFiles(files, `uploads/${type}`)
      .then( uploadedFiles => res.json(uploadedFiles))
      .catch( error => this.handleError(res, error))

   };

};
import projectModel from "./../../models/projectModel.js"



export const getAllProjects = async (req, res, next) => {
    try {
        let projects = await projectModel.find();

        res.status(200).json({ projects });
    } catch (err) {
        err.statusCode = 500;

        next(err);
    }
}

export const getProjectById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let project = await projectModel.findById(id)
        if (project) {

            res.status(200).json({ project });
        } else {
            res.status(401).json({ message: 'project does not exist !!' });

        }
    } catch (err) {
        err.statusCode = 500;

        next(err);
    }
}

export const getProjectsStats = async (req, res, next) => {
    try {

        let allProjectsCount = await projectModel.find().countDocuments()
        let openProjectsCount = await projectModel.find({ status: 'open' }).countDocuments()
        let closeProjectsCount = await projectModel.find({ status: 'close' }).countDocuments()
        let pendingProjectsCount = await projectModel.find({ status: 'pending' }).countDocuments()
        let completeProjectsCount = await projectModel.find({ status: 'complete' }).countDocuments()
        // let offersCount = await projectModel
        res.status(200).json({ 
                allProjectsCount,  openProjectsCount , closeProjectsCount ,
                pendingProjectsCount , completeProjectsCount });
            
        

    } catch (err) {
        err.statusCode = 500;

        next(err);

    }
}

export const deactiveProject = async (req, res, next) => {
    try {
        let id = req.body.id;
        let status = req.body.status;
    
        let deactivatedProject =await projectModel.findByIdAndUpdate( id , { status },{ new : true   });
        res.status(200).json({deactivatedProject})

    } catch (err) {
        err.statusCode = 500;

        next(err);
    }
}
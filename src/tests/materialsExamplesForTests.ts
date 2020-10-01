import Material from "../Models/Materials/material.entity";
import CreateMaterialDto from "../Models/Materials/material.dto";


class MaTerialsExamples {


validMaterial1:Material={
    materialCode:"mat123",
    materialName:"material1"
};
validMaterial2:Material={
    materialCode:"mat456",
    materialName:"material2"
};

 validMaterialDTO:CreateMaterialDto={
    materialCode:"mat789",
    materialName:"material3"
};
    validMaterialForUpdateDTO:CreateMaterialDto={
        materialCode:"mar456",
        materialName:"material10"
    };
 validMaterials:Material[]=[this.validMaterial1,this.validMaterial2];

    invalidMaterialwithToshortCcde:Material={
        materialCode:"mat",
        materialName:"material4"
    };
    invalidMaterialwithToLongCcde:Material={
        materialCode:"material12345",
        materialName:"material5"
    };

    invalidMaterialwhichDuplicateMaterial1DTO:CreateMaterialDto={
        ...this.validMaterial1
    };
    invalidMaterialwhichDuplicateMaterial1CodeDTO:CreateMaterialDto={
        ...this.validMaterial1,
        materialName:"material6"
    };
    invalidMaterialwhichDuplicateMaterial1NameDTO:CreateMaterialDto={
        ...this.validMaterial1,
        materialCode:"mat987"
    };
}

export default MaTerialsExamples;
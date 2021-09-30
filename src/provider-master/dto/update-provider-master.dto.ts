import { IsDefined, IsNotEmpty } from 'class-validator';
import { CreateProviderMasterDto } from './create-provider-master.dto';

export class UpdateProviderMasterDto {
    @IsDefined()
    @IsNotEmpty()
    name: string
    desv: string
    icon: string
}

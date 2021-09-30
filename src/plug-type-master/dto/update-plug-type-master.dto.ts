import { IsNotEmpty } from 'class-validator';
import { CreatePlugTypeMasterDto } from './create-plug-type-master.dto';

export class UpdatePlugTypeMasterDto {
    @IsNotEmpty()
    p_title: string;
    p_icon: string
}

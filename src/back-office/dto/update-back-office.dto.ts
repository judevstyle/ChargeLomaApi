import { PartialType } from '@nestjs/mapped-types';
import { CreateBackOfficeDto } from './create-back-office.dto';

export class UpdateBackOfficeDto extends PartialType(CreateBackOfficeDto) {}

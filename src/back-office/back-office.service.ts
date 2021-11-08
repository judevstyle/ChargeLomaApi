import { Injectable } from '@nestjs/common';
import { CreateBackOfficeDto } from './dto/create-back-office.dto';
import { UpdateBackOfficeDto } from './dto/update-back-office.dto';

@Injectable()
export class BackOfficeService {
  create(createBackOfficeDto: CreateBackOfficeDto) {
    return 'This action adds a new backOffice';
  }

  findAll() {
    return `This action returns all backOffice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backOffice`;
  }

  update(id: number, updateBackOfficeDto: UpdateBackOfficeDto) {
    return `This action updates a #${id} backOffice`;
  }

  remove(id: number) {
    return `This action removes a #${id} backOffice`;
  }
}

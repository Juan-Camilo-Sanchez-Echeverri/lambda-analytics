import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { IndicatorsService } from './indicators.service';

import {
  CreateIndicatorDto,
  UpdateIndicatorDto,
  FilterIndicatorDto,
} from './dto';

@ApiTags('indicators')
@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Post()
  create(@Body() createIndicatorDto: CreateIndicatorDto) {
    return this.indicatorsService.create(createIndicatorDto);
  }

  @Get()
  findAll(@Query() filter: FilterIndicatorDto) {
    return this.indicatorsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.indicatorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndicatorDto: UpdateIndicatorDto,
  ) {
    return this.indicatorsService.update(id, updateIndicatorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.indicatorsService.remove(id);
  }
}

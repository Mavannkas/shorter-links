import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createNewRedirectResponse,
  RedirectLinkResponse,
} from 'src/interfaces/redirect-link';
import { generateRandomString } from 'src/utils/generate-random-string';
import { CreateNewRedirectLinkDto } from './dto/create-new-redirect-link.dto';
import { RedirectLink } from './entity/redirect-link.entity';
import axios from 'axios';
import { UpdateRedirectLinkSourceDto } from './dto/update-redirect-link.dto';

@Injectable()
export class ShortenService {
  async createNewRedirect(
    createNewRedirectData: CreateNewRedirectLinkDto,
  ): Promise<createNewRedirectResponse> {
    await this.checkIfSourceExists(createNewRedirectData.source);

    const newRedirect = await this.buildRedirect(createNewRedirectData);
    await newRedirect.save();

    return {
      redirectLink: newRedirect.redirect_link,
    };
  }

  async buildRedirect(
    createNewRedirectData: CreateNewRedirectLinkDto,
  ): Promise<RedirectLink> {
    const newRedirect = new RedirectLink();
    newRedirect.source = createNewRedirectData.source;

    if (createNewRedirectData.customID) {
      newRedirect.id = await this.checkCustomID(createNewRedirectData.customID);
    } else {
      newRedirect.id = await this.generateDefaultID();
    }

    return newRedirect;
  }

  async checkCustomID(id: string) {
    if (await this.checkIsIdExists(id)) {
      throw new BadRequestException('this customID is exists now');
    }

    return id;
  }

  async generateDefaultID(): Promise<string> {
    let id = generateRandomString(10);

    while (await this.checkIsIdExists(id)) {
      id = generateRandomString(10);
    }

    return id;
  }

  async checkIsIdExists(id: string): Promise<boolean> {
    return Boolean((await RedirectLink.find({ id })).length);
  }

  async getRedirectByCustomId(id: string) {
    return await RedirectLink.findOneOrFail({ id });
  }

  async checkIfSourceExists(source: string) {
    try {
      await axios.get(source);
    } catch (err) {
      throw new BadRequestException('Source is invalid or not exists');
    }
  }

  async getRedirectLink(id: string): Promise<RedirectLinkResponse> {
    const redirectLink = await this.getRedirectById(id);
    return this.prepareResponseData(redirectLink);
  }

  // async updateRedirectLink(
  //   id: string,
  //   updateData: UpdateRedirectLinkSourceDto,
  // ): Promise<RedirectLinkResponse> {
  //   const redirectLink = await this.getRedirectById(id);
  // }

  // async updateRedirectLinkCustomId(
  //   id: string,
  //   updateData: UpdateRedirectLinkSourceDto,
  // ): Promise<RedirectLinkResponse> {
  //   const redirectLink = await this.getRedirectById(id);
  // }

  // async updateRedirectLinkSource(
  //   id: string,
  //   updateData: UpdateRedirectLinkSourceDto,
  // ): Promise<RedirectLinkResponse> {
  //   const redirectLink = await this.getRedirectById(id);
  // }

  // async deleteRedirectLink(id: string): Promise<RedirectLinkResponse> {
  //   const redirectLink = await this.getRedirectById(id);
  // }

  async getRedirectById(id: string): Promise<RedirectLink> {
    try {
      return await RedirectLink.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException('This redirect link not exists');
    }
  }

  prepareResponseData(redirectLink: RedirectLink): RedirectLinkResponse {
    return {
      id: redirectLink.id,
      redirectLink: redirectLink.redirect_link,
      created_at: redirectLink.created_at,
      source: redirectLink.source,
      redirect_link_id: redirectLink.redirect_link_id,
    };
  }
}

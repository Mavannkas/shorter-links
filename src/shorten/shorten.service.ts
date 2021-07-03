import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createNewRedirectResponse,
  DeleteRedirectLinkResponse,
  RedirectLinkPageResponse,
  RedirectLinkResponse,
} from 'src/interfaces/redirect-link';
import { generateRandomString } from 'src/utils/generate-random-string';
import { CreateNewRedirectLinkDto } from './dto/create-new-redirect-link.dto';
import { RedirectLink } from './entity/redirect-link.entity';
import axios from 'axios';
import { UpdateRedirectLinkDto } from './dto/update-redirect-link.dto';
import { User } from 'src/user/entity/user.entity';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';

@Injectable()
export class ShortenService {
  async createNewRedirect(
    createNewRedirectData: CreateNewRedirectLinkDto,
    user?: User,
  ): Promise<createNewRedirectResponse> {
    // await this.checkIfSourceExists(createNewRedirectData.source);

    const newRedirect = await this.buildRedirect(createNewRedirectData, user);
    await newRedirect.save();

    return {
      source: createNewRedirectData.source,
      redirectLink: newRedirect.redirect_link,
    };
  }

  async buildRedirect(
    createNewRedirectData: CreateNewRedirectLinkDto,
    user?: User | undefined,
  ): Promise<RedirectLink> {
    const newRedirect = new RedirectLink();
    newRedirect.source = createNewRedirectData.source;

    if (createNewRedirectData.customID) {
      newRedirect.id = await this.checkCustomID(createNewRedirectData.customID);
    } else {
      newRedirect.id = await this.generateDefaultID();
    }

    newRedirect.user_id = user ?? null;

    return newRedirect;
  }

  async checkCustomID(id: string) {
    if (await this.checkIsIdExists(id)) {
      throw new ForbiddenException('this customID is exists now');
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
      throw new ForbiddenException('Source is invalid or not exists');
    }
  }

  async getRedirectLinkPage(
    page: number,
    limit: number,
    user: User,
  ): Promise<RedirectLinkPageResponse> {
    if (page <= 0) throw new BadRequestException('Page must be positive');

    const [items, count] = await RedirectLink.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      where: [
        {
          user_id: user.user_id,
        },
      ],
      order: {  
        created_at: 'DESC',
      },
    });

    const lastPage = Math.ceil(count / limit);

    return {
      items: items.map(this.prepareResponseData),
      page,
      lastPage,
    };
  }

  async getRedirectLink(id: string, user: User): Promise<RedirectLinkResponse> {
    const redirectLink = await this.getRedirectById(id, user);
    return this.prepareResponseData(redirectLink);
  }

  async updateRedirectLink(
    id: string,
    updateData: UpdateRedirectLinkDto,
    user: User,
  ): Promise<RedirectLinkResponse> {
    await this.checkUpdateData(updateData);

    const redirectLink = await this.updateRedirectById(id, updateData, user);

    await redirectLink.save();

    return this.prepareResponseData(redirectLink);
  }

  async checkUpdateData({
    source = undefined,
    customID = undefined,
  }): Promise<void> {
    if (source) await this.checkIfSourceExists(source);
    if (customID) await this.checkCustomID(customID);
  }

  async updateRedirectById(
    id: string,
    { source = undefined, customID = undefined },
    user: User,
  ): Promise<RedirectLink> {
    const redirectLink = await this.getRedirectById(id, user);
    if (source) redirectLink.source = source;
    if (customID) redirectLink.id = customID;
    return redirectLink;
  }

  async deleteRedirectLink(
    id: string,
    user: User,
  ): Promise<DeleteRedirectLinkResponse> {
    const redirectLink = await this.getRedirectById(id, user);
    redirectLink.id = null;
    redirectLink.deleted = true;

    await redirectLink.save();
    return {
      ok: '1',
    };
  }

  async getRedirectById(id: string, user: User): Promise<RedirectLink> {
    try {
      return await RedirectLink.findOneOrFail({
        redirect_link_id: id,
        deleted: false,
        user_id: user,
      });
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
